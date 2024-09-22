import { Router } from "express";

import { OtpController } from "./otp.controller";

const router = Router();

router.post("/otp", OtpController.sendOtp);
router.post("/otp/verify", OtpController.verifyOtp);

export { router as otpRoutes };
