import { Router } from 'express';
import * as comicBookCtrl from '../controllers/comicbooks';

// ============================================================================
// CREATE ROUTER
// ============================================================================

const router = Router();

// ============================================================================
// ROUTES
// ============================================================================

// GET /comicBooks?questionId=___
router.get('/', comicBookCtrl.getQuestionComicBooks);

// POST /comicBooks
router.post('/', comicBookCtrl.createComicBook);

// GET /comicBooks/:id
router.get('/:id', comicBookCtrl.getOneById);

// PUT /comicBooks/:id
router.put('/:id', comicBookCtrl.updateComicBook);

// DELETE /comicBooks/:id
router.delete('/:id', comicBookCtrl.removeComicBook);

// ============================================================================
// EXPORT
// ============================================================================

export default router;