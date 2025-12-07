import { RfpRepo, rfpRepo } from './repository';
import { rfpCategoryRepo, RfpCategoryRepo } from '@module/rfp-category';
import { sendPrompt } from '@util/send-prompt';
import { AppError } from '@core/app-error';

class RfpService {
  constructor(
    private readonly repo: RfpRepo,
    private readonly rfpCategoryRepo: RfpCategoryRepo
  ) {}

  async generateRfp(text: string) {
    // generate rfp formatted data from the ai
    const rfpData = await this.generateRfpFormattedData(text);

    // Resolve category
    let categoryId: string;
    const existingCategory = await this.rfpCategoryRepo.getByName(rfpData.category);

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const newCategory = await this.rfpCategoryRepo.create({ name: rfpData.category });
      categoryId = newCategory.id;
    }

    return this.repo.create({
      title: rfpData.title,
      maxBudget: rfpData.maxBudget,
      quantity: rfpData.quantity,
      timeToDeliver: rfpData.timeToDeliver,
      requirements: rfpData.requirements,
      categoryId: categoryId,
    });
  }

  private async generateRfpFormattedData(text: string) {
    const prompt = `Generate a Request for Proposal (RFP) based on the following text.

    Text: "${text}"

    If the text contains valid requirements or description for an RFP, populate the fields.
    If the text is gibberish, irrelevant, or does not contain enough information to form an RFP, set 'isValid' to false.
    The 'maxBudget' should be a numeric string (e.g., "1000", "50000").
    The 'quantity' should be an integer.
    The 'timeToDeliver' should be an integer (days).
    The 'requirements' should be a list of specific requirements.
    The 'category' should be a concise category name that matches the text content (e.g. "Electronics", "Software", "Construction").
    `;

    const schema = {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING', description: 'A concise title for the RFP' },
        maxBudget: { type: 'STRING', description: 'The maximum budget as a numeric string' },
        quantity: { type: 'INTEGER', description: 'Quantity required' },
        timeToDeliver: { type: 'INTEGER', description: 'Time to deliver in days' },
        requirements: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'List of key requirements extracted or inferred',
        },
        category: { type: 'STRING', description: 'The suggested category name' },
        isValid: { type: 'BOOLEAN', description: 'True if valid RFP content, false otherwise' },
      },
      required: ['title', 'maxBudget', 'quantity', 'requirements', 'category', 'isValid'],
    };

    const res = await sendPrompt(prompt, schema);

    if (!res.isValid) {
      throw AppError.BadRequestError('Invalid or insufficient text to generate an RFP.');
    }

    return res;
  }
}

const rfpService = new RfpService(rfpRepo, rfpCategoryRepo);

export { RfpService, rfpService };
