import {Router} from 'express';
import {addBook, searchBooks} from '../controllers/index.js';
const router = Router();

router.post('/add-book',addBook);
router.get('/books',searchBooks);

export const bookRoutes = router;