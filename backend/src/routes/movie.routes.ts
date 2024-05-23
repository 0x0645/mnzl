import { Router } from 'express';
import { getMovies } from '../controller/movie.controller';

const router = Router();

router.get('/api/movies', getMovies);

export default router;
