import { RfpCategoryRepo, rfpCategoryRepo } from './repository';
import { AppError } from '@core/app-error';

class RfpCategoryService {
  constructor(private readonly repo: RfpCategoryRepo) {}

  async create(name: string) {
    const existing = await this.repo.getByName(name);
    if (existing) {
      throw AppError.ConflictError('Category with this name already exists');
    }
    return this.repo.create({ name });
  }

  async getAll() {
    return this.repo.getAll({
      params: {
        limit: 100,
        page: 1,
      },
    }); // Default listing
  }
}

const rfpCategoryService = new RfpCategoryService(rfpCategoryRepo);

export { RfpCategoryService, rfpCategoryService };
