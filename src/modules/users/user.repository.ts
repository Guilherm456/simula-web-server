import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pagination } from '@types';
import { Model } from 'mongoose';
import { FilterDTO } from 'src/interfaces/query.interface';
import { buildFilter } from 'src/middleware/filter';
import { User } from './entities/user.entity';
@Injectable()
export class UsersRepository {
  constructor(@InjectModel('users') private readonly userModel: Model<User>) {}

  async getUser(userID: string): Promise<User> {
    return await this.userModel.findById(userID).lean().exec();
  }

  async createUser(user: Omit<User, 'createdAt'>): Promise<User> {
    const newUser = new this.userModel({
      ...user,
      // createdAt: new Date().toISOString(),
    });
    return await newUser.save();
  }

  async getUsers({ limit = 10, offset = 0, ...query }: FilterDTO = {}): Promise<
    Pagination<User>
  > {
    const filter = buildFilter(query);
    const [content, totalElements] = await Promise.all([
      await this.userModel
        .find({
          __v: false,
          active: true,
          ...filter,
        })
        .skip(offset * limit)
        .limit(limit)
        .exec(),
      await this.userModel
        .countDocuments({
          active: true,
          ...filter,
        })
        .exec(),
    ]);

    const totalPages = Math.ceil(totalElements / limit);
    const hasNext = offset + 1 < totalPages;

    return {
      content,
      totalElements,
      totalPages,
      hasNext,
    } as Pagination<User>;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  async updateColumn(id: string, column: string, value: any): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(id, {
        [column]: value,
        updatedAt: new Date().toISOString(),
      })
      .exec();
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(id, {
        ...user,
        updatedAt: new Date().toISOString(),
      })
      .exec();
  }

  async deleteUser(id: string): Promise<User> {
    return await this.updateColumn(id, 'active', false);
  }
  async userExists(id: string): Promise<boolean> {
    return !!(await this.userModel.exists({ _id: id }).exec());
  }
}
