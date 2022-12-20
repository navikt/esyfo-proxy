import { AutomatiskReaktiveringSvar, PrismaClient } from '@prisma/client';
import logger from '../logger';

export interface AutomatiskReaktiveringSvarRepository {
    lagre(svarDto: AutomatiskReaktiveringSvarDto): Promise<AutomatiskReaktiveringSvar>;
    hent(bruker: string, reaktiveringsId: number): Promise<AutomatiskReaktiveringSvar | null>;
}

export interface AutomatiskReaktiveringSvarDto {
    brukerId: string;
    svar: string;
    automatiskReaktiveringId: number;
}

function createAutomatiskReaktiveringRepository(prismaClient: PrismaClient): AutomatiskReaktiveringSvarRepository {
    return {
        async lagre(svarDto: AutomatiskReaktiveringSvarDto): Promise<AutomatiskReaktiveringSvar> {
            return prismaClient.automatiskReaktiveringSvar.create({
                data: {
                    bruker_id: svarDto.brukerId,
                    svar: svarDto.svar,
                    automatisk_reaktivering_id: svarDto.automatiskReaktiveringId,
                },
            });
        },
        async hent(bruker: string, reaktiveringsId: number) {
            try {
                return await prismaClient.automatiskReaktiveringSvar.findFirst({
                    where: {
                        bruker_id: {
                            equals: bruker,
                        },
                        automatisk_reaktivering_id: {
                            equals: reaktiveringsId,
                        },
                    },
                    orderBy: {
                        id: 'desc',
                    },
                });
            } catch (err) {
                logger.error(`Feil ved henting av automatiskReaktivert: ${err}`);
                throw err;
            }
        },
    };
}

export default createAutomatiskReaktiveringRepository;
