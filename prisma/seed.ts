import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
    const testProfil = await prisma.profil.create({
        data: {
            bruker_id: 'test',
        },
    });
    console.log({ testProfil });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
