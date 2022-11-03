import { Request, Router } from 'express';
import { Context, initialize, isEnabled, Strategy } from 'unleash-client';
import config from '../config';

class ByEnvironmentStrategy extends Strategy {
    isEnabled(parameters: { [key: string]: string }, context: Context): boolean {
        const environmentList: string[] = parameters['miljø']?.split(',') || [];
        return environmentList.includes(context.environment!);
    }
}

initialize({
    appName: 'aia-backend',
    url: config.UNLEASH_API_URL,
    environment: config.UNLEASH_ENVIRONMENT,
    strategies: [new ByEnvironmentStrategy('byEnvironment')],
});

function ensureArray(features?: string | Array<string>) {
    if (!features) {
        return [];
    }

    if (Array.isArray(features)) {
        return features;
    }

    return [features];
}

type FeatureQuery = {
    feature: string;
};

function unleashRoutes() {
    const router = Router();

    router.get('/unleash', (req: Request<any, any, any, FeatureQuery>, res) => {
        const features = ensureArray(req.query.feature).reduce((acc, key) => {
            const k = encodeURIComponent(key);
            return {
                ...acc,
                [k]: isEnabled(key),
            };
        }, {});

        res.send(features);
    });

    return router;
}

export default unleashRoutes;
