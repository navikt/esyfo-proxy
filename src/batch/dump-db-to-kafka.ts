import { PrismaClient } from '@prisma/client';
import createProducer from '../kafka/automatisk-reaktivert-producer';

const prismaClient = new PrismaClient();
const kafkaProducer = await createProducer();

console.log('Starter med å dumpe automatiskReaktivering...');
await kafkaProducer.send(await prismaClient.automatiskReaktivering.findMany());
console.log('Ferdig med automatiskReaktivering');

console.log('Starter med å dumpe automatiskReaktiveringSvar...');
await kafkaProducer.send(await prismaClient.automatiskReaktiveringSvar.findMany());
console.log('Ferdig med automatiskReaktiveringSvar');
