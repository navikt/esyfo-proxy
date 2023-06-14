import { Router } from 'express';
import config from '../../config';
import { getDefaultHeaders, proxyHttpCall } from '../../http';
import axios from 'axios';
import { BehovRepository } from '../../db/behovForVeiledningRepository';

function veilederApi(behovForVeiledningRepository: BehovRepository, besvarelseUrl = config.BESVARELSE_URL) {
    const router = Router();

    router.post('/veileder/besvarelse', proxyHttpCall(`${besvarelseUrl}/api/v1/veileder/besvarelse`));

    router.post('/veileder/behov-for-veiledning', async (req, res) => {
        try {
            const { foedselsnummer } = req.body;
            const { status } = await axios(`${besvarelseUrl}/api/v1/veileder/har-tilgang`, {
                headers: getDefaultHeaders(req),
                method: 'POST',
                data: { foedselsnummer },
            });

            if (status !== 200) {
                // TODO
            }
        } catch (err) {
        } finally {
            res.status(200).end();
        }
    });

    return router;
}

export default veilederApi;
