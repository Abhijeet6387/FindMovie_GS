import { Router } from 'express';
import Auth from './auth.js';
import Movie from './movie.js';

const router = Router()
router.use('/auth', Auth);    // Handles Authentication routes
router.use('/movie', Movie);  // Handles Movies routes

export default router;
