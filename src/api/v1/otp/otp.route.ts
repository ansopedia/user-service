import { Router } from "express";

import { OtpController } from "./otp.controller.js";

const router = Router();

router.post("/otp", OtpController.sendOtp);
router.post("/otp/verify", OtpController.verifyOtp);

export { router as otpRoutes };
