const amqp = require('amqplib');
const { createStatistics, createGrade } = require('./statisticsService');

class MessagingService {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queueName = 'grade_sync_queue';
        this.exchangeName = 'grade_exchange';
    }

    async connect() {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672');
            this.channel = await this.connection.createChannel();

            // Assert exchange and queue, then bind
            await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: true });
            await this.channel.assertQueue(this.queueName, { durable: true });
            await this.channel.bindQueue(this.queueName, this.exchangeName, '');

            console.log('✅ StatisticsService connected to RabbitMQ');
        } catch (error) {
            console.error('❌ Failed to connect to RabbitMQ:', error.message);
            throw error;
        }
    }

    async startConsuming() {
        try {
            if (!this.channel) {
                await this.connect();
            }

            console.log('StatisticsService waiting for grade sync messages...');

            this.channel.consume(this.queueName, async (msg) => {
                if (msg) {
                    try {
                        const message = JSON.parse(msg.content.toString());
                        if (message.type === 'GRADE_SYNC' && message.data && message.data.institutionID) {
                            // Create grade in statistics DB
                            await createGrade({
                                student_id: message.data.student_id,
                                course_id: message.data.course_id,
                                exam_period: message.data.exam_period,
                                question_grades: message.data.question_grades,
                                grading_status: message.data.grading_status,
                                total_grade: message.data.total_grade,
                                institution_id: message.data.institutionID,
                                instructor_id: message.data.instructor_id
                            });
                        }
                        if (message.type === 'GRADE_SYNC_COMPLETE' && message.data && message.data.institutionID) {
                            await createStatistics(message.data.institutionID);
                        }
                        this.channel.ack(msg);
                    } catch (error) {
                        console.error('❌ Error processing grade sync message:', error.message);
                        this.channel.nack(msg, false, true);
                    }
                }
            });
        } catch (error) {
            console.error('❌ Error starting RabbitMQ consumer:', error.message);
            throw error;
        }
    }

    async close() {
        try {
            if (this.channel) await this.channel.close();
            if (this.connection) await this.connection.close();
            console.log('✅ RabbitMQ connection closed');
        } catch (error) {
            console.error('❌ Error closing RabbitMQ connection:', error.message);
        }
    }
}

module.exports = new MessagingService();