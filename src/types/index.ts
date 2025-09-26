// import mongoose from "mongoose";
// import z from "zod";
import mongoose from "mongoose";
import z from "zod";

export const mongooseObjectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId")
  .transform((val) => new mongoose.Types.ObjectId(val))
  .brand("MongooseObjectId");

// // export type MongooseObjectId = z.infer<typeof mongooseObjectId>;

// export const Tokens = {
//   ACCESS: "access",
//   REFRESH: "refresh",
//   ACTION: "action",
// } as const;
// export type Tokens = (typeof Tokens)[keyof typeof Tokens];

// // export type LoggedInUser = {
// //   userId: MongooseObjectId;
// //   permissions: string[];
// //   deviceId: DeviceInfo["deviceId"];
// //   tokenVersion: number;
// // };

// // export const email = z
// //   .string({ message: "Email is required" })
// //   .min(1, { message: "Email is required" })
// //   .email({ message: "Invalid email format" })
// //   .transform((val) => val.toLowerCase().trim());

// // export type Email = z.infer<typeof email>;

// // export const otp = z.string().length(6);

// // export type Otp = z.infer<typeof otp>;

// /**
//  * Convert IResult from ua-parser-js into Zod schema
//  * (so that `.extend()` works)
//  */
// const uaParserResultSchema = z.object({
//   ua: z.string().optional(),
//   browser: z
//     .object({
//       name: z.string().optional(),
//       version: z.string().optional(),
//       major: z.string().optional(),
//     })
//     .optional(),
//   engine: z
//     .object({
//       name: z.string().optional(),
//       version: z.string().optional(),
//     })
//     .optional(),
//   os: z
//     .object({
//       name: z.string().optional(),
//       version: z.string().optional(),
//     })
//     .optional(),
//   device: z
//     .object({
//       vendor: z.string().optional(),
//       model: z.string().optional(),
//       type: z.string().optional(),
//     })
//     .optional(),
//   cpu: z
//     .object({
//       architecture: z.string().optional(),
//     })
//     .optional(),
// });

// export const deviceId = z.string().uuid();

// export type DeviceId = z.infer<typeof deviceId>;

// /**
//  * Device info schema with both ua-parser-js fields and custom fields
//  */
// export const deviceInfoSchema = uaParserResultSchema.extend({
//   // Persistent unique ID for the device (client-generated or server-assigned)
//   // deviceId: z.custom<ReturnType<typeof crypto.randomUUID>>().optional(),
//   deviceId: deviceId.optional(),
//   // Flag for bot detection, useful for blocking automated abuse
//   isBot: z.boolean(),
//   // IP address of the client
//   ip: z.string(),
//   // When the request was made (server time)
//   timestamp: z.date(),
//   // Screen resolution, if client sends it (useful for anomaly detection)
//   screen: z
//     .object({
//       width: z.number().optional(),
//       height: z.number().optional(),
//     })
//     .optional(),
//   // Geo info, for security alerts & fraud detection
//   geolocation: z
//     .object({
//       country: z.string().optional(),
//       city: z.string().optional(),
//       timezone: z.string().optional(),
//       lat: z.number().optional(),
//       lon: z.number().optional(),
//     })
//     .optional(),
//   // Network metadata for profiling suspicious logins
//   network: z
//     .object({
//       isp: z.string().optional(),
//       connectionType: z.string().optional(),
//     })
//     .optional(),
// });

// export type DeviceInfo = z.infer<typeof deviceInfoSchema>;

// export * from "./passport-google.js";
// export * from "./socket.types.js";
