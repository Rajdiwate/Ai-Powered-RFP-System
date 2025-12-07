import { VendorService, vendorService } from './service';
import { Request, Response } from 'express';

class VendorController {
  constructor(private readonly service: VendorService) {}

  create = async (req: Request, res: Response) => {
    const vendor = await this.service.create(req.body);
    res.created('Vendor created successfully', vendor);
  };

  getAll = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string);
    const page = parseInt(req.query.page as string);
    const result = await this.service.getAll(limit, page);
    res.ok('Vendors retrieved successfully', result);
  };

  notifyVendor = async (req: Request, res: Response) => {
    const vendor = await this.service.notifyVendor(req.body.id, req.body.rfpId);
    res.ok('Vendor notified successfully', vendor);
  };
}

const vendorController = new VendorController(vendorService);

export { VendorController, vendorController };
