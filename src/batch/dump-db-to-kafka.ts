import { PrismaClient } from '@prisma/client';
import createProducer from '../kafka/automatisk-reaktivert-producer';

(async function () {
    const prismaClient = new PrismaClient();
    const kafkaProducer = await createProducer();

    const lt = new Date(process.argv[2]);
    const gt = new Date(process.argv[3]);

    // automatiskReaktivering cutoff '2023-02-27 12:22:53.584000 UTC'
    // svar cutoff '2023-02-27 12:26:09.939000 UTC'

    console.log('Starter med å hente automatiskReaktivering...');
    const automatiskReaktivering = await prismaClient.automatiskReaktivering.findMany({
        where: {
            created_at: {
                lt,
                gt,
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
                lt,
                gt,
            },
        },
    });

    console.log(`Fant ${automatiskReaktiveringSvar.length} rader`);
    console.log('Dumper automatiskReaktiveringSvar på kafka...');
    await kafkaProducer.send(automatiskReaktiveringSvar);
    console.log('Ferdig med automatiskReaktiveringSvar\n\n');
})();
