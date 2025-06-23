const amqp = require('amqplib');

class RabbitMQService {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queueName = 'grade_sync_queue';
        this.exchangeName = 'grade_exchange';
        this.userCreatedQueue = 'user_created_queue_grading';
        this.userExchangeName = 'user_exchange';
    }

    async connect() {
        try {
            // Connect to RabbitMQ (default localhost:5672)
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672');
            this.channel = await this.connection.createChannel();
            
            // Declare exchange for grades
            await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: true });
            
            // Declare queue for grades
            await this.channel.assertQueue(this.queueName, { durable: true });
            
            // Bind queue to exchange
            await this.channel.bindQueue(this.queueName, this.exchangeName, '');

            // Declare exchange for users
            await this.channel.assertExchange(this.userExchangeName, 'fanout', { durable: true });
            
            // Declare queue for user creation events for this service
            await this.channel.assertQueue(this.userCreatedQueue, { durable: true });
            
            // Bind queue to user exchange
            await this.channel.bindQueue(this.userCreatedQueue, this.userExchangeName, '');
            
            console.log('✅ RabbitMQ connection established');
        } catch (error) {
            console.error('❌ RabbitMQ connection failed:', error.message);
            throw error;
        }
    }

    async consumeUserCreated(onMessage) {
        if (!this.channel) {
            throw new Error("RabbitMQ channel not available. Call connect() first.");
        }
        console.log(`👂 Waiting for messages in ${this.userCreatedQueue}`);
        
        await this.channel.consume(this.userCreatedQueue, (msg) => {
            if (msg !== null) {
                try {
                    console.log('📥 Received user creation message');
                    const message = JSON.parse(msg.content.toString());
                    onMessage(message.data);
                    this.channel.ack(msg);
                } catch (error) {
                    console.error('Error processing user creation message:', error);
                    this.channel.nack(msg, false, false); // Discard message on error
                }
            }
        });
    }

    async sendGradeData(gradeData) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            // Ensure institutionID is in camelCase for consumers
            const payload = { ...gradeData };
            if (payload.institution_id) {
                payload.institutionID = payload.institution_id;
                delete payload.institution_id;
            }

            const message = {
                type: 'GRADE_SYNC',
                timestamp: new Date().toISOString(),
                data: payload
            };

            const messageBuffer = Buffer.from(JSON.stringify(message));
            
            // Publish to exchange
            this.channel.publish(
                this.exchangeName,
                '',
                messageBuffer,
                { persistent: true }
            );

            console.log('✅ Grade data sent to RabbitMQ:', {
                studentId: gradeData.student_id,
                courseId: gradeData.course_id,
                totalGrade: gradeData.total_grade,
                institutionID: payload.institutionID
            });

            return true;
        } catch (error) {
            console.error('❌ Failed to send grade data to RabbitMQ:', error.message);
            throw error;
        }
    }

    async sendGradeSyncComplete({ institution_id }) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            const message = {
                type: 'GRADE_SYNC_COMPLETE',
                timestamp: new Date().toISOString(),
                data: { institutionID: institution_id }
            };
            const messageBuffer = Buffer.from(JSON.stringify(message));
            this.channel.publish(this.exchangeName, '', messageBuffer, { persistent: true });
            console.log('✅ Sent GRADE_SYNC_COMPLETE to RabbitMQ for institution', institution_id);
        } catch (error) {
            console.error('❌ Failed to send GRADE_SYNC_COMPLETE to RabbitMQ:', error.message);
            throw error;
        }
    }

    async close() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            console.log('✅ RabbitMQ connection closed');
        } catch (error) {
            console.error('❌ Error closing RabbitMQ connection:', error.message);
        }
    }
}

module.exports = new RabbitMQService(); 