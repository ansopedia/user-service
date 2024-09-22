import axios from "axios";

import { envConstants } from "@/constants";
import { logger } from "@/utils";

import { EmailNotification } from "./notification.validation";

const sendEmail = async (body: EmailNotification) => {
  try {
    await axios.post(`${envConstants.NOTIFICATION_SERVICE_BASE_URL}/api/v1/emails`, body);
  } catch (error) {
    logger.error(`Error while sending email, ${error}`);
  }
};

export const notificationService = {
  sendEmail,
};
