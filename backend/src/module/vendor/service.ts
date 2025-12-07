import { RfpRepo, rfpRepo } from '@module/rfp';
import { VendorRepo, vendorRepo } from './repository';
import { InferSelectModel } from 'drizzle-orm';
import { RfpTable } from '@db/schema';
import { sendPrompt } from '@util/send-prompt';
import { AppError } from '@core/app-error';
import { sendEmail } from '@util/email.util';

class VendorService {
  constructor(
    private readonly repo: VendorRepo,
    private readonly rfpRepo: RfpRepo
  ) {}

  async create(data: { name: string; email: string; phone: string; address: string }) {
    return this.repo.create(data);
  }

  async getAll(limit: number, page: number) {
    return this.repo.getAll({
      params: {
        limit: limit ?? 50,
        page: page ?? 1,
      },
    });
  }

  async notifyVendor(vendorId: string, rfpId: string) {
    // get the rfp
    const rfp = await this.rfpRepo.getById(rfpId);
    const vendor = await this.repo.getById(vendorId);

    if (!rfp || !vendor) {
      throw AppError.NotFoundError('RFP or Vendor not found');
    }

    // TODO: push this to somw sort of queue and create a consumer to send emails

    // generate detailed text specifying the details of the rfp from ai
    const html = await this.generateDetailedText(rfp);

    // send email to the vendor
    await sendEmail({ to: vendor.email, subject: `RFP Notification [Ref: ${rfp.id}]`, html });
  }

  private async generateDetailedText(rfp: InferSelectModel<typeof RfpTable>) {
    const prompt = `
      You are an AI assistant helping to notify vendors about a new Request for Proposal (RFP).
      Create a professional HTML email template for the following RFP.
      The email should clearly state the title, budget, time to deliver, and requirements.
      It should encourage the vendor to apply.
      Use inline CSS for styling to ensure it looks good in email clients.

      RFP Details:
      Title: ${rfp.title}
      Max Budget: ${rfp.maxBudget}
      Quantity: ${rfp.quantity}
      Time to Deliver: ${rfp.timeToDeliver} days
      Requirements: ${JSON.stringify(rfp.requirements)}
    `;

    const schema = {
      type: 'OBJECT',
      properties: {
        htmlContent: {
          type: 'STRING',
          description: 'The raw HTML content for the email body.',
        },
      },
      required: ['htmlContent'],
    };

    const res = await sendPrompt(prompt, schema);
    return res.htmlContent;
  }
}

const vendorService = new VendorService(vendorRepo, rfpRepo);

export { VendorService, vendorService };
