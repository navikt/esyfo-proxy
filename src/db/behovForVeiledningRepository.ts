import { Oppfolging, BehovForVeiledning, PrismaClient } from '@prisma/client';
import logger from '../logger';

interface LagreBehovDto {
    bruker: string;
    oppfolging: Oppfolging;
    dialogId?: string;
}

export interface BehovRepository {
    lagreBehov(data: LagreBehovDto): Promise<BehovForVeiledning>;
    hentBehov(bruker: string): Promise<BehovForVeiledning | null>;
}

function createBehovRepository(prismaClient: PrismaClient): BehovRepository {
    return {
        async lagreBehov(data: LagreBehovDto): Promise<BehovForVeiledning> {
            return prismaClient.behovForVeiledning.create({
                data: { bruker_id: data.bruker, oppfolging: data.oppfolging, dialog_id: data.dialogId },
            });
        },
        async hentBehov(bruker: string): Promise<BehovForVeiledning | null> {
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

                return behov;
            } catch (err) {
                logger.error(`Feil ved henting av profil: ${err}`);
                throw err;
            }
        },
    };
}

export default createBehovRepository;
