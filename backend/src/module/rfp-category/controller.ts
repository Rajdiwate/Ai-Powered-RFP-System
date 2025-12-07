import { RfpCategoryService, rfpCategoryService } from './service';
import { Request, Response } from 'express';

class RfpCategoryController {
  constructor(private readonly service: RfpCategoryService) {}

  create = async (req: Request, res: Response) => {
    const { name } = req.body;
    const category = await this.service.create(name);
    res.created('Category created successfully', category);
  };

  getAll = async (req: Request, res: Response) => {
    const result = await this.service.getAll();
    res.ok('Categories fetched successfully', result);
  };
}

const rfpCategoryController = new RfpCategoryController(rfpCategoryService);

export { RfpCategoryController, rfpCategoryController };
