import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./swagger.yaml');

const router = Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;