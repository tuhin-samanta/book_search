import {Router} from 'express';
import {register, login} from '../controllers/index.js';
const router = Router();

router.post('/register', register);
router.post('/login', login);

export const authRoutes= router;

