import { envConstants } from "@/constants";
import { logger } from "@/utils";

import { EmailNotification } from "./notification.validation";

const sendEmail = async (body: EmailNotification) => {
  try {
    const response = await fetch(`${envConstants.NOTIFICATION_SERVICE_BASE_URL}/api/v1/emails`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        origin: envConstants.USER_SERVICE_BASE_URL,
      },
    });

    if (!response.ok) {
      const responseBody = await response.text();
      logger.error({
        message: "Email notification service responded with an error",
        status: response.status,
        statusText: response.statusText,
        responseBody,
        requestBody: body,
      });
      throw new Error(`Notification service error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    logger.error({
      message: "Exception while sending email",
      error,
      requestBody: body,
    });
    throw error;
  }
};

export const notificationService = {
  sendEmail,
};
