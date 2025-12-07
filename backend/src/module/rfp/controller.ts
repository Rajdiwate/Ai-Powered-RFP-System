import { RfpService, rfpService } from './service';
import { Request, Response } from 'express';

class RfpController {
  constructor(private readonly service: RfpService) {}

  generateRfp = async (req: Request, res: Response) => {
    const { text } = req.body;
    const rfp = await this.service.generateRfp(text);
    res.created('RFP generated successfully', rfp);
  };
}

const rfpController = new RfpController(rfpService);

export { RfpController, rfpController };
