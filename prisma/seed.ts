import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
    const testProfil = await prisma.profil.create({
        data: {
            bruker_id: 'test',
            profil: {},
        },
    });
    console.log({ testProfil });

    const behovForVeiledning = await prisma.behovForVeiledning.create({
        data: {
            bruker_id: 'test',
            oppfolging: 'KLARE_SEG_SELV',
        },
    });
    console.log({ behovForVeiledning });
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
