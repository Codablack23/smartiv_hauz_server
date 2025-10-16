/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Mail from 'nodemailer/lib/mailer';
import { ENVIRONMENT } from 'src/config/config.env';
import { SendMailClient } from 'zeptomail';

interface MailOptions extends Omit<Mail.Options, 'from' | 'sender' | 'to'> {
  to: string[];
}

export class MailProvider {
  private static url = 'api.zeptomail.com/';
  private static token = ENVIRONMENT.SECRETS.ZOHO_TOKEN;
  private static zeptoClient = new SendMailClient({
    url: this.url,
    token: this.token,
  });

  static async sendMail(options: MailOptions) {
    try {
      await this.zeptoClient.sendMail({
        from: {
          address: 'noreply@smartivhauz.com',
          name: '',
        },
        to: options.to.map((item) => ({
          email_address: {
            address: item,
            name: item,
          },
        })),
        subject: options.subject,
        htmlbody: options.html,
      });
    } catch (error) {
      console.log({ ...error });
    }
  }
}
