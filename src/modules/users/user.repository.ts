import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterDTO } from 'src/interfaces/query.interface';
import { User } from './entities/user.entity';
@Injectable()
export class UsersRepository {
  constructor(@InjectModel('users') private readonly userModel: Model<User>) {}

  async getUser(userID: string): Promise<User> {
    return await this.userModel.findById(userID).exec();
  }

  async createUser(user: Omit<User, 'createdAt'>): Promise<User> {
    const newUser = new this.userModel({
      ...user,
      // createdAt: new Date().toISOString(),
    });
    return await newUser.save();
  }

  async getUsers(filters: FilterDTO): Promise<User[]> {
    return await this.userModel
      .find({
        __v: false,
        ...filters,
      })
      .exec();
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

  async userExists(id: string): Promise<boolean> {
    return !!(await this.userModel.exists({ _id: id }).exec());
  }
}
