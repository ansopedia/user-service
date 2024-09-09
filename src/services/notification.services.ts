import axios from 'axios';
import { EmailNotification } from './notification.validation';
import { logger } from '@/utils';
import { envConstants } from '@/constants';

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
