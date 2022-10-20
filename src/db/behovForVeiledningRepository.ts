import { Oppfolging, PrismaClient } from '@prisma/client';
import logger from '../logger';

interface LagreBehovDto {
    bruker: string;
    oppfolging: Oppfolging;
}

export interface BehovRepository {
    lagreBehov(data: LagreBehovDto): Promise<void>;
    hentBehov(bruker: string): Promise<Oppfolging | null>;
}

function createBehovRepository(prismaClient: PrismaClient): BehovRepository {
    return {
        async lagreBehov(data: LagreBehovDto) {
            await prismaClient.behovForVeiledning.create({
                data: { bruker_id: data.bruker, oppfolging: data.oppfolging },
            });
        },
        async hentBehov(bruker: string): Promise<Oppfolging | null> {
            try {
                const behov = await prismaClient.behovForVeiledning.findFirst({
                    where: {
                        bruker_id: {
                            equals: bruker,
                        },
                    },
                    orderBy: {
                        id: 'desc',
                    },
                });

                if (!behov) {
                    return null;
                }

                return behov.oppfolging;
            } catch (err) {
                logger.error(`Feil ved henting av profil: ${err}`);
                return null;
            }
        },
    };
}

export default createBehovRepository;
