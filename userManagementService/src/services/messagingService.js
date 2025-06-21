const amqp = require('amqplib');

class MessagingService {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queueName = 'password_update_queue';
    }

    async connect() {
        try {
            // Connect to RabbitMQ (default localhost:5672)
            this.connection = await amqp.connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            
            // Ensure the queue exists
            await this.channel.assertQueue(this.queueName, {
                durable: true // Queue survives broker restart
            });
            
            console.log('Connected to RabbitMQ');
        } catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
            throw error;
        }
    }

    async sendPasswordUpdateMessage(userData) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            const message = {
                email: userData.email,
                password: userData.password,
                timestamp: new Date().toISOString()
            };

            // Send message to queue
            await this.channel.sendToQueue(
                this.queueName,
                Buffer.from(JSON.stringify(message)),
                {
                    persistent: true // Message survives broker restart
                }
            );

            console.log('Password update message sent to queue:', message.email);
        } catch (error) {
            console.error('Failed to send password update message:', error);
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

module.exports = new MessagingService(); 