import dotenv from 'dotenv';
import winston from 'winston';
import { Kafka, Partitioners } from 'kafkajs'; // Importa Kafka solo si es necesario

dotenv.config();

const CLIENT_ID = process.env.KAFKA_SERVICE_NAME ?? 'UNKNOWN';
const logLevel = process.env.LOGLEVEL ? process.env.LOGLEVEL : 'INFO';
const kafkaEnabled = process.env.KAFKA_ENABLED === 'true';
let kafkaBroker, kafkaTopic, kafka, producer;

// Configuración de Winston
const logger = winston.createLogger({
  level: logLevel.toLowerCase(),  // El nivel de log es configurable
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(), // Log a la consola
    new winston.transports.File({ filename: 'app.log' }) // Log a un archivo
  ],
});

if (kafkaEnabled) {
  process.env.KAFKAJS_NO_PARTITIONER_WARNING = 1;
  kafkaBroker = process.env.KAFKA_BROKER ?? 'localhost:9092';
  kafkaTopic = process.env.KAFKA_TOPIC ?? 'logs';
  kafka = new Kafka({ clientId: CLIENT_ID, brokers: [kafkaBroker], createPartitioner: Partitioners.LegacyPartitioner });
  producer = kafka.producer();

  const connectKafka = async () => {
    await producer.connect();
    logger.info('Conectado a Kafka');
  };

  await connectKafka();
}

// Función para enviar logs a Kafka
const sendLogToKafka = async (formattedMessage) => {
  if (kafkaEnabled) {
    await producer.send({
      topic: kafkaTopic,
      messages: [{ value: formattedMessage }],
    });
    logger.info(`Mensaje enviado a Kafka: ${formattedMessage}`);
  }
};

// Función para formatear el mensaje
const logMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `${timestamp} [${CLIENT_ID}][${level}]: ${message}`;
};

// Función para logear mensajes de tipo INFO
const info = async (message) => {
  if (logLevel === 'INFO' || logLevel === 'DEBUG') {
    const formattedMessage = logMessage('INFO', message);
    logger.info(formattedMessage); // Log en consola y archivo
    await sendLogToKafka(formattedMessage); // Enviar a Kafka
  }
};

// Función para logear mensajes de tipo DEBUG
const debug = async (message) => {
  if (logLevel === 'DEBUG') {
    const formattedMessage = logMessage('DEBUG', message);
    logger.debug(formattedMessage); // Log en consola y archivo
    await sendLogToKafka(formattedMessage); // Enviar a Kafka
  }
};

// Asigna los métodos a global.logger para acceder globalmente
global.logger = { info, debug };