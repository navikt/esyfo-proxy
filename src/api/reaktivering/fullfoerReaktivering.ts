import { Auth } from '../../auth/tokenDings';
import config from '../../config';
import { Router } from 'express';
import { getTokenXHeadersForVeilarbregistrering } from '../veilarbregistrering';
import { proxyTokenXCall } from '../../http';

function fullfoerReaktivering(tokenDings: Auth, veilarbregistreringUrl = config.VEILARBREGISTRERING_URL): Router {
    const router = Router();
    const getTokenXHeaders = getTokenXHeadersForVeilarbregistrering(tokenDings);

    router.post(
        '/fullfoerreaktivering',
        proxyTokenXCall(`${veilarbregistreringUrl}/veilarbregistrering/api/fullfoerreaktivering`, getTokenXHeaders),
    );

    return router;
}

export default fullfoerReaktivering;
