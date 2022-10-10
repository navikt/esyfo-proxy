import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger';

function swaggerRoutes() {
    const router = Router();

    router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    return router;
}

export default swaggerRoutes;
