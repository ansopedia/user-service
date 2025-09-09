export const ServiceEnum = {
  USER_SERVICE: "user-service",
  NOTIFICATION_SERVICE: "notification-service",
  CMS_SERVICE: "cms-service",
  CHAT_SERVICE: "chat-service",
} as const;

export type ServiceEnum = (typeof ServiceEnum)[keyof typeof ServiceEnum];

export const SERVICE_AUDIENCE = Object.values(ServiceEnum);

export const CURRENT_SERVICE = ServiceEnum.USER_SERVICE;
