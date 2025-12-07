import { Router } from "express";

import { ROUTES } from "../../../constants/routes.constant.js";
import { OtpController } from "./otp.controller.js";

const router = Router();

router.post(ROUTES.OTP.ROOT, OtpController.sendOtp);
router.post(ROUTES.OTP.VERIFY, OtpController.verifyOtp);

export { router as otpRoutes };
