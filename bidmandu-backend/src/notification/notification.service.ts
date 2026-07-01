import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendEmail(to: string, subject: string, body: string) {
    // Placeholder: in production integrate with nodemailer / SendGrid
    this.logger.log(`[EMAIL] To: ${to} | Subject: ${subject} | Body: ${body}`);
  }

  async notifySellerShipping(transactionId: string, sellerEmail: string) {
    await this.sendEmail(
      sellerEmail,
      'Payment Verified – Time to Ship',
      `Transaction ${transactionId} has been verified. Please ship the item.`,
    );
  }

  async notifyBuyerConfirmed(transactionId: string, buyerEmail: string) {
    await this.sendEmail(
      buyerEmail,
      'Receipt Confirmed',
      `Your receipt for transaction ${transactionId} has been confirmed.`,
    );
  }

  async notifyBuyerAutoConfirm(transactionId: string, buyerEmail: string) {
    await this.sendEmail(
      buyerEmail,
      'Receipt Auto‑Confirmed',
      `We have automatically confirmed receipt for transaction ${transactionId} after 5 days.`,
    );
  }
}