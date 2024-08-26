import {Router} from 'express';
import bookController from '../controllers';
const router = Router();

router.post('/add-book', bookController.addBook);
router.get('/books', bookController.searchBooks);

export const bookRoutes = router;