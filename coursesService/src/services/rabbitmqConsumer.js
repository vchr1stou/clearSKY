const amqp = require('amqplib');
const Grade = require('../models/grades');

class RabbitMQConsumer {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queueName = 'grade_sync_queue';
        this.exchangeName = 'grade_exchange';
    }

    async connect() {
        try {
            // Connect to RabbitMQ (default localhost:5672)
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672');
            this.channel = await this.connection.createChannel();
            
            // Declare exchange
            await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: true });
            
            // Declare queue
            await this.channel.assertQueue(this.queueName, { durable: true });
            
            // Bind queue to exchange
            await this.channel.bindQueue(this.queueName, this.exchangeName, '');
            
            console.log('✅ RabbitMQ consumer connected');
        } catch (error) {
            console.error('❌ RabbitMQ consumer connection failed:', error.message);
            throw error;
        }
    }

    async startConsuming() {
        try {
            if (!this.channel) {
                await this.connect();
            }

            console.log('🔄 Starting to consume grade sync messages...');

            this.channel.consume(this.queueName, async (msg) => {
                if (msg) {
                    try {
                        const message = JSON.parse(msg.content.toString());
                        console.log('📨 Received grade sync message:', message.type);

                        if (message.type === 'GRADE_SYNC') {
                            await this.processGradeData(message.data);
                        }

                        // Acknowledge the message
                        this.channel.ack(msg);
                    } catch (error) {
                        console.error('❌ Error processing message:', error.message);
                        // Reject the message and requeue it
                        this.channel.nack(msg, false, true);
                    }
                }
            });

        } catch (error) {
            console.error('❌ Error starting consumer:', error.message);
            throw error;
        }
    }

    async processGradeData(gradeData) {
        try {
            console.log('🔄 Processing grade data for student:', gradeData.student_id);

            // Check if grade already exists
            const existingGrade = await Grade.findOne({
                where: {
                    studentID: gradeData.student_id,
                    courseID: gradeData.course_id,
                    exam_period: gradeData.exam_period
                }
            });

            if (existingGrade) {
                // Update existing grade
                await existingGrade.update({
                    question_grades: gradeData.question_grades,
                    total_grade: gradeData.total_grade,
                    grading_status: gradeData.grading_status || 'closed'
                });
                console.log('✅ Updated existing grade for student:', gradeData.student_id);
            } else {
                // Create new grade - use the correct field names
                const gradeDataToInsert = {
                    courseID: gradeData.course_id,
                    studentID: gradeData.student_id,
                    question_grades: gradeData.question_grades,
                    exam_period: gradeData.exam_period,
                    grading_status: gradeData.grading_status || 'closed',
                    total_grade: gradeData.total_grade,
                    institutionID: gradeData.institution_id || 1 // Default institution ID
                };

                try {
                    await Grade.create(gradeDataToInsert);
                    console.log('✅ Created new grade for student:', gradeData.student_id);
                } catch (dbError) {
                    console.error('❌ Database error creating grade:', dbError.message);
                    throw dbError;
                }
            }

        } catch (error) {
            console.error('❌ Error processing grade data:', error.message);
            console.error('Full error:', error);
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
            console.log('✅ RabbitMQ consumer connection closed');
        } catch (error) {
            console.error('❌ Error closing RabbitMQ consumer connection:', error.message);
        }
    }
}

module.exports = new RabbitMQConsumer(); 