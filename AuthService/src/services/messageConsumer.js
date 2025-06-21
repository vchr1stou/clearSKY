const amqp = require('amqplib');
const User = require('../models/user.js');

class MessageConsumer {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queueName = 'password_update_queue';
    }

    async connect() {
        try {
            // Connect to RabbitMQ
            this.connection = await amqp.connect('amqp://localhost');
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
                        console.log('Received password update message for:', message.email);
                        
                        // Update password in authdb
                        await User.update(
                            { password: message.password },
                            { where: { email: message.email } }
                        );
                        
                        console.log('Password updated in authdb for:', message.email);
                        
                        // Acknowledge the message
                        this.channel.ack(msg);
                    } catch (error) {
                        console.error('Error processing password update message:', error);
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