import { Router } from 'express';
import { OTPController } from './otp.controller';

const router = Router();

router.post('/otp', OTPController.sendOtp);
// router.post('/otp/verify', AuthController.verifyOtp);

export { router as otpRoutes };
