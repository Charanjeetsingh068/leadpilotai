import { Request, Response, NextFunction } from 'express';
import { FacebookWebhookService } from '../services/facebook-webhook.service';

export class FacebookWebhookController {
  private service: FacebookWebhookService;

  constructor() {
    this.service = new FacebookWebhookService();
  }

  verify = (req: Request, res: Response, next: NextFunction) => {
    try {
      const mode = req.query['hub.mode'] as string;
      const token = req.query['hub.verify_token'] as string;
      const challenge = req.query['hub.challenge'] as string;

      const result = this.service.verifyWebhook(mode, token, challenge);
      if (result) {
        return res.status(200).send(result);
      }
      return res.status(403).json({ error: 'Verification token mismatch' });
    } catch (err) {
      next(err);
    }
  };

  receive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers['x-hub-signature-256'] as string;
      const rawBody = JSON.stringify(req.body);

      const result = await this.service.processWebhookEvent(rawBody, signature);
      return res.status(200).json(result);
    } catch (err: any) {
      console.error('Webhook processing error:', err.message);
      return res.status(500).json({ error: err.message });
    }
  };
}
