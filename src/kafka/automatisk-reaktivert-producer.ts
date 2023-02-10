import { CompressionTypes, Kafka, KafkaConfig } from 'kafkajs';
import config from '../config';

interface Producer {
    start(): Promise<void>;
    stop(): Promise<void>;
    send(data: any): Promise<void>;
}

const kafkaConfig: KafkaConfig = {
    clientId: config.APP_NAME,
    brokers: [config.KAFKA_BROKERS],
    ssl: !config.KAFKA_CA
        ? false
        : {
              rejectUnauthorized: false,
              ca: [config.KAFKA_CA],
              key: config.KAFKA_PRIVATE_KEY,
              cert: config.KAFKA_CERTIFICATE,
          },
};
const createProducer = (): Producer => {
    const kafka = new Kafka(kafkaConfig);
    const producer = kafka.producer();

    return {
        async start(): Promise<void> {
            try {
                await producer.connect();
            } catch (e) {}
        },
        async send(data: any): Promise<void> {
            try {
                await producer.send({
                    topic: 'topic',
                    compression: CompressionTypes.GZIP,
                    messages: [
                        {
                            value: JSON.stringify(data),
                        },
                    ],
                });
            } catch (e) {}
        },
        async stop(): Promise<void> {
            try {
                await producer.disconnect();
            } catch (e) {}
        },
    };
};

export default createProducer;
