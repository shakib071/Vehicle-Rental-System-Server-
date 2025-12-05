import { Router } from "express";
import { authController } from "./auth.controller";



const router = Router();

// root path is /api/v1/auth 

router.post('/signup', authController.SignUp);
router.post('/signin',authController.SignIn);

export const authRoutes = router;