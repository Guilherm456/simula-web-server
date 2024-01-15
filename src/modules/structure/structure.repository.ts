import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterDTO, Pagination } from '@types';
import { buildFilter } from 'src/middleware/filter';
import { Structure, StructureModel } from './entities/structures.interface';

@Injectable()
export class StructureRepository {
  constructor(
    @InjectModel('structures')
    private readonly structures: StructureModel,
  ) {}

  async create(structure: Structure) {
    const newStructure = new this.structures(structure);
    return await newStructure.save();
  }

  async getAllStructures({ limit = 10, offset = 0, ...query }: FilterDTO = {}) {
    const filter = buildFilter(query);

    const [content, totalElements] = await Promise.all([
      this.structures
        .find({
          __v: false,
          ...filter,
        })
        // .select('-parameters')
        .skip(offset * limit)
        .limit(limit)
        .exec(),
      this.structures.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(totalElements / limit);
    const hasNext = offset + 1 < totalPages;

    return {
      content,
      totalElements,
      totalPages,
      hasNext,
    } as Pagination<Structure>;
  }

  async getByID(structureID: string): Promise<Structure> {
    return await this.structures.findById(structureID).exec();
  }
}
