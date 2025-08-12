import { Request } from "express";
import { UAParser } from "ua-parser-js";
import { isBot } from "ua-parser-js/helpers";

import { DeviceInfo } from "../types";
import { enrichWithGeo } from "./geo";

/**
 * Extract robust device info for logging/authentication purposes.
 *
 * Why we store each field in the backend:
 * - `screen`: Helps fingerprint devices (e.g., attacker uses same IP but different screen size)
 * - `timestamp`: Audit trail for when the session was created or last refreshed
 * - `isBot`: Detect and block known bots from creating sessions
 * - `geolocation`: Security alerts (e.g., login from a new country) and fraud prevention
 * - `network`: ISP or connection type anomalies can indicate suspicious logins
 */
export const getDeviceInfo = (req: Request): DeviceInfo => {
  const ua = (req.headers["user-agent"] as string) || "";
  const parser = new UAParser(ua);
  const result = parser.getResult();

  const isBotResult = isBot(ua);

  // Device ID from client header (persistent per install)
  const deviceIdHeader: DeviceInfo["deviceId"] = req.headers["x-device-id"] as DeviceInfo["deviceId"];

  // Resolve IP in order of trust
  const forwardedFor = (req.headers["x-forwarded-for"] as string) || "";
  const ip =
    forwardedFor.split(",").map((ip) => ip.trim())[0] ??
    (req.headers["x-real-ip"] as string) ??
    req.socket.remoteAddress ??
    "unknown";

  // Screen resolution if provided
  const screenWidth = parseInt(req.headers["sec-ch-viewport-width"] as string, 10);
  const screenHeight = parseInt(req.headers["sec-ch-viewport-height"] as string, 10);
  const screen = !isNaN(screenWidth) && !isNaN(screenHeight) ? { width: screenWidth, height: screenHeight } : undefined;

  // Geolocation from CDN/proxy headers
  const geo: DeviceInfo["geolocation"] = {
    country: (req.headers["cf-ipcountry"] as string) || undefined,
    timezone: (req.headers["cf-timezone"] as string) || undefined,
    ...enrichWithGeo(ip),
  };

  // Network details
  const network: DeviceInfo["network"] = {
    connectionType: req.headers["sec-ch-ua-mobile"] === "?1" ? "mobile" : "desktop",
  };

  return {
    ...result,
    deviceId: deviceIdHeader,
    isBot: isBotResult,
    ip,
    timestamp: new Date(),
    screen,
    geolocation: geo,
    network,
  };
};
