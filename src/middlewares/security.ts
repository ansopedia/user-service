// src/middleware/security.ts
import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";

import { ErrorTypeEnum } from "../constants";
import { getDeviceInfo } from "../utils/device-info";

// const redis = new Redis(env.REDIS_URL);

// 1. Device Information Middleware
export const deviceInfoMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  req.deviceInfo = getDeviceInfo(req); // Use your existing getDeviceInfo function
  next();
};

// 2. Bot Detection Middleware
export const botDetection = (req: Request, _: Response, next: NextFunction) => {
  if (req.deviceInfo?.isBot === true) {
    throw new Error(ErrorTypeEnum.Enum.BOT_ACCESS_FORBIDDEN);
  }
  next();
};

// 3. Suspicious Device Detection
export const suspiciousDeviceCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.deviceInfo) return next();

  const warnings: string[] = [];
  let riskScore = 0;

  // Screen anomalies
  if (!req.deviceInfo.screen) {
    warnings.push("Missing screen information");
    riskScore += 20;
  } else if (
    (req.deviceInfo.screen.width ?? 0) > 10000 ||
    (req.deviceInfo.screen.height ?? 0) > 10000
  ) {
    warnings.push("Impossible screen resolution detected");
    riskScore += 30;
  }

  // Browser anomalies
  if (req.deviceInfo.browser?.name === "Headless Chrome") {
    warnings.push("Headless browser detected");
    riskScore += 40;
  }

  // IP anomalies
  const isp = req.deviceInfo.network?.isp?.toLowerCase();
  if (isp?.includes("vpn") === true || isp?.includes("proxy") === true) {
    warnings.push("VPN/Proxy detected");
    riskScore += 25;
  }

  // Add risk context to request
  req.security = {
    riskScore,
    warnings,
  };

  // Require CAPTCHA for high-risk devices
  if (riskScore >= 50 && !req.body.captchaToken) {
    return res.status(403).json({
      error: "Suspicious device detected",
      warnings,
      captchaRequired: true,
    });
  }

  // Verify CAPTCHA if provided
  if (riskScore >= 50 && req.body.captchaToken) {
    if (!validateCaptcha(req.body.captchaToken)) {
      return res.status(403).json({
        error: "Invalid CAPTCHA",
        warnings,
      });
    }
  }

  next();
};

// 4. Rate Limiting Middleware
export const securityRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each device to 100 requests per window
  keyGenerator: (req) => {
    return `${req.deviceInfo?.ip ?? "unknown-ip"}:${req.deviceInfo?.deviceId ?? "no-device-id"}`;
  },
  handler: (req, res) => {
    const rateLimitInfo = (req as any).rateLimit;
    res.status(429).json({
      error: "Too many requests",
      retryAfter: rateLimitInfo?.resetTime,
    });
  },
});

// 5. Token Security Middleware
export const tokenSecurity = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken ?? req.headers.authorization?.split(" ")[1];
  if (token === undefined || token === "") return next();

  try {
    // Verify token signature
    const payload = jwt.verify(token, process.env.JWT_PUBLIC_KEY ?? "", {
      algorithms: ["RS256"],
    }) as Record<string, unknown>;

    // Check token revocation
    const isRevoked = await AuthService.isTokenRevoked(
      payload.sessionId as string,
      payload.tokenVersion as number
    );

    if (isRevoked === true) {
      return res.status(401).json({ error: "Token revoked" });
    }

    // Add token payload to request
    req.auth = payload;

    // Check token binding to device
    if (payload.deviceId !== req.deviceInfo?.deviceId) {
      AuthService.logSecurityEvent({
        userId: payload.userId as string,
        type: "DEVICE_MISMATCH",
        message: "Token used from different device than issued",
        severity: "high",
      });
      return res.status(401).json({ error: "Device mismatch" });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// 6. Impossible Travel Detection
export const impossibleTravelDetection = async (req: Request, res: Response, next: NextFunction) => {
  if (req.auth?.sessionId === undefined || req.deviceInfo?.geolocation === undefined) return next();

  try {
    const session = await Session.findById(req.auth.sessionId);
    if (session === null || session.deviceInfo.geolocation === undefined) return next();

    const currentLocation = req.deviceInfo.geolocation;
    const lastLocation = session.deviceInfo.geolocation;

    // Calculate distance between locations
    const distance = calculateDistance(
      lastLocation.lat ?? 0,
      lastLocation.lon ?? 0,
      currentLocation.lat ?? 0,
      currentLocation.lon ?? 0
    );

    // Calculate time difference in hours
    const timeDiffHours = (Date.now() - session.lastActive.getTime()) / (1000 * 60 * 60);

    // Detect impossible travel (> 500km in < 1 hour)
    if (distance > 500 && timeDiffHours < 1) {
      AuthService.logSecurityEvent({
        userId: req.auth.userId as string,
        type: "IMPOSSIBLE_TRAVEL",
        message: `Traveled ${distance.toFixed(0)} km in ${timeDiffHours.toFixed(1)} hours`,
        severity: "critical",
      });

      // Revoke session immediately
      await AuthService.revokeSession(req.auth.sessionId);

      return res.status(403).json({
        error: "Suspicious activity detected",
        code: "IMPOSSIBLE_TRAVEL",
      });
    }

    next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Travel detection error:", error);
    next();
  }
};

// 7. Location Policy Enforcement
export const locationPolicy = (allowedCountries: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.deviceInfo?.geolocation?.country === undefined) return next();

    const { country } = req.deviceInfo.geolocation;

    if (!allowedCountries.includes(country)) {
      AuthService.logSecurityEvent({
        userId: (req.auth?.userId as string) ?? "unknown",
        type: "GEO_BLOCKED",
        message: `Access attempt from blocked country: ${country}`,
        severity: "high",
      });

      return res.status(403).json({
        error: "Access not permitted from your region",
        country,
      });
    }

    next();
  };
};

// 8. Session Freshness Check
export const sessionFreshness = (maxAgeMinutes: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.auth?.sessionId === undefined) return next();

    const session = await Session.findById(req.auth.sessionId);
    if (session === null) return next();

    const sessionAge = (Date.now() - session.lastActive.getTime()) / (1000 * 60);

    if (sessionAge > maxAgeMinutes) {
      return res.status(401).json({
        error: "Session expired",
        code: "SESSION_EXPIRED",
      });
    }

    // Update last active time
    session.lastActive = new Date();
    await session.save();

    next();
  };
};

// 9. Security Headers Middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Set security headers
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "same-origin");
  res.setHeader("Content-Security-Policy", "default-src 'self'");

  // Add device context to headers for downstream services
  if (req.deviceInfo !== undefined) {
    res.setHeader("X-Device-Id", req.deviceInfo.deviceId ?? "unknown");
    res.setHeader("X-Device-Type", req.deviceInfo.device?.type ?? "unknown");
    res.setHeader("X-Device-OS", req.deviceInfo.os?.name ?? "unknown");
  }

  next();
};

// 10. Security Event Logging Middleware
export const securityEventLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    AuthService.logSecurityEvent({
      userId: (req.auth?.userId as string) ?? "anonymous",
      type: "REQUEST_COMPLETED",
      message: `${req.method} ${req.path} - ${res.statusCode}`,
      severity: "info",
      metadata: {
        status: res.statusCode,
        duration,
        deviceId: req.deviceInfo?.deviceId,
        ip: req.deviceInfo?.ip,
        userAgent: req.headers["user-agent"],
        riskScore: req.security?.riskScore ?? 0,
        warnings: req.security?.warnings ?? [],
      },
    });
  });

  next();
};

// Helper Functions -----------------------------------------------------

// Distance calculation (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const deg2rad = (deg: number) => deg * (Math.PI / 180);

// CAPTCHA validation (mock implementation)
const validateCaptcha = (token: string): boolean => {
  // In real implementation, verify with CAPTCHA service
  return token.length > 10; // Simple mock
};

// Security Service Extension -------------------------------------------
export const AuthService = {
  ...AuthService, // Your existing AuthService methods

  isTokenRevoked: async (sessionId: string, tokenVersion: number): Promise<boolean> => {
    return (await redis.get(`revoked:${sessionId}:${tokenVersion}`)) === "1";
  },

  revokeSession: async (sessionId: string): Promise<void> => {
    // Get current token version
    const session = await Session.findById(sessionId);
    if (session === null) return;

    // Mark as revoked
    await redis.set(`revoked:${sessionId}:${session.tokenVersion}`, "1", "EX", 60 * 60 * 24 * 30);

    // Invalidate all tokens for this session
    await Session.findByIdAndUpdate(sessionId, { $inc: { tokenVersion: 1 } });
  },

  logSecurityEvent: (event: SecurityEvent): void => {
    const payload = {
      ...event,
      timestamp: new Date().toISOString(),
      ip: event.metadata?.ip ?? "unknown",
    };
    redis.xadd("security:events", "*", ...Object.entries(payload).flat());
  },
};

interface SecurityEvent {
  userId: string;
  type: string;
  message: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}
