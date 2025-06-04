import { ErrorTypeEnum, envConstants } from "@/constants";

import { errorLogger } from "../utils/logger";
import { EmailNotification } from "./notification.validation";

const sendEmail = async (body: EmailNotification) => {
  // Skiping sending notification for test environment
  if (envConstants.NODE_ENV === "test") return;

  let response: Response | undefined;
  try {
    response = await fetch(`${envConstants.NOTIFICATION_SERVICE_BASE_URL}/api/v1/emails`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        origin: envConstants.USER_SERVICE_BASE_URL,
      },
      // Add timeout (optional but recommended)
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "fetch failed") {
        throw new Error(ErrorTypeEnum.Enum.NOTIFICATION_SERVICE_UNAVAILABLE);
      }
    } else {
      // TODO: fix with appropriate error message
      throw new Error(ErrorTypeEnum.Enum.INTERNAL_SERVER_ERROR);
    }
  }

  if (response && !response.ok) {
    const responseBody = await response.json();
    errorLogger.error({
      message: "Email notification service responded with an error",
      status: response.status,
      statusText: response.statusText,
      responseBody,
      requestBody: body,
    });

    throw new Error(ErrorTypeEnum.Enum.NOTIFICATION_SERVICE_MISCONFIGURED);
  }
};

export const notificationService = {
  sendEmail,
};
