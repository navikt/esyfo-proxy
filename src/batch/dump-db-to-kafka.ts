import { PrismaClient } from '@prisma/client';
import createProducer from '../kafka/automatisk-reaktivert-producer';

(async function () {
    const prismaClient = new PrismaClient();
    const kafkaProducer = await createProducer();

    console.log('Starter med å hente automatiskReaktivering...');
    const automatiskReaktivering = await prismaClient.automatiskReaktivering.findMany({
        where: {
            created_at: {
                lt: new Date(),
            },
        },
    });
    console.log(`Fant ${automatiskReaktivering.length} rader`);
    console.log('Dumper automatiskReaktivering på kafka...');
    await kafkaProducer.send(automatiskReaktivering);
    console.log('Ferdig med automatiskReaktivering\n\n\n');

    console.log('Starter med å hente automatiskReaktiveringSvar...');
    const automatiskReaktiveringSvar = await prismaClient.automatiskReaktiveringSvar.findMany({
        where: {
            created_at: {
                lt: new Date(),
            },
        },
    });

    console.log(`Fant ${automatiskReaktiveringSvar.length} rader`);
    console.log('Dumper automatiskReaktiveringSvar på kafka...');
    await kafkaProducer.send(automatiskReaktiveringSvar);
    console.log('Ferdig med automatiskReaktiveringSvar');
})();
