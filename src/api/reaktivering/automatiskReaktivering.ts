import { RequestHandler, Router } from 'express';
import azureAdAuthentication from '../../middleware/azure-ad-authentication';
import { AutomatiskReaktiveringRepository } from '../../db/automatiskReaktiveringRepository';
import { KafkaProducer } from '../../kafka/automatisk-reaktivert-producer';

function automatiskReaktiveringRoutes(
    repository: AutomatiskReaktiveringRepository,
    automatiskReaktivertProducer: KafkaProducer,
    authMiddleware: RequestHandler = azureAdAuthentication
) {
    const router = Router();

    router.post('/azure/automatisk-reaktivering', authMiddleware, async (req, res) => {
        const { fnr } = req.body;

        if (!fnr) {
            res.status(400).send('mangler fnr');
            return;
        }
        try {
            const result = await repository.lagre(fnr);
            await automatiskReaktivertProducer.send([result]);
            res.status(201).send(result);
        } catch (e) {
            // log
            res.status(500).end();
        }
    });

    return router;
}

export default automatiskReaktiveringRoutes;
