import { AutomatiskReaktivering, AutomatiskReaktiveringSvar } from '@prisma/client';
import { Kafka, KafkaConfig } from 'kafkajs';
import config from '../config';
import logger from '../logger';

export interface KafkaProducer {
    send(data: Array<AutomatiskReaktivering | AutomatiskReaktiveringSvar>): Promise<void>;
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
const createProducer = async (): Promise<KafkaProducer> => {
    const kafka = new Kafka(kafkaConfig);
    const producer = kafka.producer();

    await producer.connect();

    return {
        async send(data: Array<AutomatiskReaktivering | AutomatiskReaktiveringSvar>): Promise<void> {
            const messages = data.map((d) => {
                if ('svar' in d) {
                    return {
                        value: JSON.stringify({
                            bruker_id: d.bruker_id,
                            created_at: d.created_at,
                            svar: d.svar,
                            type: 'AutomatiskReaktiveringSvar',
                        }),
                    };
                }
                return {
                    value: JSON.stringify({
                        bruker_id: d.bruker_id,
                        created_at: d.created_at,
                        type: 'AutomatiskReaktivering',
                    }),
                };
            });

            try {
                await producer.send({
                    topic: config.KAFKA_TOPIC,
                    messages,
                });
            } catch (e) {
                logger.error(`Fikk ikke sendt melding til kafka ${e}`);
            }
        },
    };
};

export default createProducer;
