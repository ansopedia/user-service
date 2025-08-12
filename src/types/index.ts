import mongoose from "mongoose";
import z from "zod";

export const mongooseObjectId = z.custom<mongoose.Types.ObjectId>();

export type MongooseObjectId = z.infer<typeof mongooseObjectId>;

export const Tokens = {
  ACCESS: "access",
  REFRESH: "refresh",
  ACTION: "action",
} as const;
export type Tokens = (typeof Tokens)[keyof typeof Tokens];

export type LoggedInUser = {
  userId: MongooseObjectId;
  permissions: string[];
  deviceId: DeviceInfo["deviceId"];
  tokenVersion: number;
};

export const username = z
  .string()
  .min(3, "username must be at least 3 characters")
  .max(18, "username must be at most 18 characters")
  .regex(/^[a-z]/i, "username must start with a letter")
  .regex(/^[a-z0-9-_]*$/i, "username can only contain alphanumeric characters, hyphens, and underscores")
  .transform((val) => val.toLowerCase().trim());

export type Username = z.infer<typeof username>;

export const password = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one numeric digit")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .refine(
    (password) => {
      const repeatedChars = /(.)\1{2,}/;
      return !repeatedChars.test(password);
    },
    {
      message: "Password should not contain repeated characters",
    }
  );

export type Password = z.infer<typeof password>;

export const email = z
  .string({ message: "Email is required" })
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email format" })
  .transform((val) => val.toLowerCase().trim());

export type Email = z.infer<typeof email>;

export const otp = z.string().length(6);

export type Otp = z.infer<typeof otp>;

/**
 * Convert IResult from ua-parser-js into Zod schema
 * (so that `.extend()` works)
 */
const uaParserResultSchema = z.object({
  ua: z.string().optional(),
  browser: z
    .object({
      name: z.string().optional(),
      version: z.string().optional(),
      major: z.string().optional(),
    })
    .optional(),
  engine: z
    .object({
      name: z.string().optional(),
      version: z.string().optional(),
    })
    .optional(),
  os: z
    .object({
      name: z.string().optional(),
      version: z.string().optional(),
    })
    .optional(),
  device: z
    .object({
      vendor: z.string().optional(),
      model: z.string().optional(),
      type: z.string().optional(),
    })
    .optional(),
  cpu: z
    .object({
      architecture: z.string().optional(),
    })
    .optional(),
});

export const deviceId = z.string().uuid();

export type DeviceId = z.infer<typeof deviceId>;

/**
 * Device info schema with both ua-parser-js fields and custom fields
 */
export const deviceInfoSchema = uaParserResultSchema.extend({
  // Persistent unique ID for the device (client-generated or server-assigned)
  // deviceId: z.custom<ReturnType<typeof crypto.randomUUID>>().optional(),
  deviceId: deviceId.optional(),
  // Flag for bot detection, useful for blocking automated abuse
  isBot: z.boolean(),
  // IP address of the client
  ip: z.string(),
  // When the request was made (server time)
  timestamp: z.date(),
  // Screen resolution, if client sends it (useful for anomaly detection)
  screen: z
    .object({
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),
  // Geo info, for security alerts & fraud detection
  geolocation: z
    .object({
      country: z.string().optional(),
      city: z.string().optional(),
      timezone: z.string().optional(),
      lat: z.number().optional(),
      lon: z.number().optional(),
    })
    .optional(),
  // Network metadata for profiling suspicious logins
  network: z
    .object({
      isp: z.string().optional(),
      connectionType: z.string().optional(),
    })
    .optional(),
});

export type DeviceInfo = z.infer<typeof deviceInfoSchema>;
