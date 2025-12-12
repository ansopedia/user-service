import { Router } from "express";

import { ROUTES } from "../../../constants/routes.constant.js";
import { OtpController } from "./otp.controller.js";

const router = Router();

router.post(ROUTES.OTP.ROOT, OtpController.sendOtp); // Send an OTP (for Email Verification or Password Reset).
router.post(ROUTES.OTP.VERIFY, OtpController.verifyOtp); // Verify an OTP token.

export { router as otpRoutes };
