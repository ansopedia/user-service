import axios from 'axios';
import { EmailNotification } from './notificaiton.validation';
import { logger } from '../utils';
import { envConstants } from '../constants';

const sendEmail = async (body: EmailNotification, serverURL: string) => {
  try {
    const config = {
      headers: {
        Origin: serverURL,
      },
    };

    await axios.post(`${envConstants.NOTIFICATION_SERVICE_BASE_URL}/api/v1/emails`, body, config);
  } catch (error) {
    logger.error(`Error while sending email, ${error}`);
  }
};

export const notificationService = {
  sendEmail,
};
