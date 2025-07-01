import express from 'express';
import { createUser,loginUser,refreshToken ,logoutUser} from '../controllers/userController.js';

const router = express.Router();


// POST route to create a new user
router.post('/admin', createUser);
// POST route to login user
router.post('/login', loginUser);

router.post('/logout',logoutUser)
router.post('/refresh-token', refreshToken);

export default router;