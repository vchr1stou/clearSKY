const amqp = require('amqplib');

class RabbitMQService {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queueName = 'grade_sync_queue';
        this.exchangeName = 'grade_exchange';
    }

    async connect() {
        try {
            // Connect to RabbitMQ (default localhost:5672)
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
            this.channel = await this.connection.createChannel();
            
            // Declare exchange
            await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: true });
            
            // Declare queue
            await this.channel.assertQueue(this.queueName, { durable: true });
            
            // Bind queue to exchange
            await this.channel.bindQueue(this.queueName, this.exchangeName, '');
            
            console.log('✅ RabbitMQ connection established');
        } catch (error) {
            console.error('❌ RabbitMQ connection failed:', error.message);
            throw error;
        }
    }

    async sendGradeData(gradeData) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            const message = {
                type: 'GRADE_SYNC',
                timestamp: new Date().toISOString(),
                data: gradeData
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
                totalGrade: gradeData.total_grade
            });

            return true;
        } catch (error) {
            console.error('❌ Failed to send grade data to RabbitMQ:', error.message);
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