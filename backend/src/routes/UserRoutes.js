import express from 'express';
import UserController from '../controllers/UserController.js';

const router = express.Router();
router.post('/register', UserController.register);
router.get('/login', UserController.login);
router.get('/getAllUsers', UserController.getAllUsers);


export default router;