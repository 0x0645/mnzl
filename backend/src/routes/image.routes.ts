import { Router } from 'express';
import { getImage } from '../controller/image.controller';

const router = Router();

router.get('/api/image/:path', getImage);

export default router;
