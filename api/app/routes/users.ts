import { Router } from 'express';
import * as userCtrl from '../controllers/users';

// ============================================================================
// CREATE ROUTER
// ============================================================================

const router = Router();

// ============================================================================
// ROUTES
// ============================================================================

// GET /users
router.get('/', userCtrl.getUsers);

// POST /users
router.post('/', userCtrl.createUser);

// GET /users/:id
router.get('/:id', userCtrl.getOneById);

// PUT /users/:id
router.put('/:id', userCtrl.updateUser);

// DELETE /users/:id
router.delete('/:id', userCtrl.removeUser);

// ============================================================================
// EXPORT
// ============================================================================

export default router;