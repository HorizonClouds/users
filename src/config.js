import dotenv from 'dotenv';
dotenv.config();


const config = {
    port: process.env.PORT || 6900,
    throttleLimit: process.env.THROTTLE_LIMIT || 100,
    throttleWindow: process.env.THROTTLE_WINDOW || 15,  // in minutes
    jwtSecret: process.env.JWT_SECRET || 'horizon-secret',
    // Kafka configuration
    kafkaEnabled: process.env.KAFKA_ENABLED || false,
    kafkaBroker: process.env.KAFKA_BROKER || 'localhost:9092',
    kafkaTopic: process.env.KAFKA_TOPIC || 'logs',
    kafkaServiceName: process.env.KAFKA_SERVICE_NAME || 'USERS',
};

export default config;