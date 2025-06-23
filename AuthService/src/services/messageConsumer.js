const amqp = require('amqplib');
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

class MessageConsumer {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queueName = 'password_update_queue';
    }

    async connect() {
        try {
            // Connect to RabbitMQ
            this.connection = await amqp.connect('amqp://user:password@rabbitmq:5672');
            this.channel = await this.connection.createChannel();
            
            // Ensure the queue exists
            await this.channel.assertQueue(this.queueName, {
                durable: true
            });
            
            console.log('AuthService connected to RabbitMQ');
        } catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
            throw error;
        }
    }

    async startConsuming() {
        try {
            if (!this.channel) {
                await this.connect();
            }

            console.log('Waiting for password update messages...');

            // Consume messages from the queue
            await this.channel.consume(this.queueName, async (msg) => {
                if (msg !== null) {
                    try {
                        const message = JSON.parse(msg.content.toString());
                        console.log('=== RECEIVED MESSAGE ===');
                        console.log('Message content:', message);
                        console.log('Message type:', message.type);
                        console.log('=======================');
                        
                        if (message.type === 'user_removal') {
                            // Handle user removal
                            console.log('Processing user removal for:', message.email);
                            
                            const deletedCount = await User.destroy({ where: { email: message.email } });
                            console.log('Deleted rows from authdb:', deletedCount);
                            
                            console.log('User removed from authdb for:', message.email);
                        } else if (message.type === 'user_creation') {
                            // Handle user creation
                            console.log('Processing user creation for:', message.email);
                            
                            // Check if user already exists in authdb
                            const existingUser = await User.findOne({ where: { email: message.email } });
                            if (existingUser) {
                                console.log('User already exists in authdb for:', message.email);
                            } else {
                                // Create user in authdb with all provided data
                                await User.create({
                                    email: message.email,
                                    password: message.password,
                                    studentID: message.studentID,
                                    FullName: message.FullName,
                                    telephone: message.telephone,
                                    role: message.role,
                                    institutionID: message.institutionID
                                });
                                
                                console.log('User created in authdb for:', message.email);
                            }
                        } else {
                            // Handle password update (backward compatibility)
                            console.log('Processing password update for:', message.email);
                            
                            // Hash the password before updating
                            const hashedPassword = await bcrypt.hash(message.password, 10);
                            
                            await User.update(
                                { password: hashedPassword },
                                { where: { email: message.email } }
                            );
                            
                            console.log('Password updated in authdb for:', message.email);
                        }
                        
                        // Acknowledge the message
                        this.channel.ack(msg);
                        console.log('Message acknowledged');
                    } catch (error) {
                        console.error('Error processing message:', error);
                        // Reject the message and requeue it
                        this.channel.nack(msg, false, true);
                    }
                }
            });
        } catch (error) {
            console.error('Failed to start consuming messages:', error);
            throw error;
        }
    }

    async close() {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
    }
}

module.exports = new MessageConsumer(); 