import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDTO } from 'src/DTO/account.dto';

import { Account } from '../Interface/account.interface';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectModel('account') private readonly accountModel: Model<Account>,
  ) {}

  async getAccount(idAccount: string): Promise<Account> {
    return await this.accountModel.findById(idAccount, { __v: false }).exec();
  }

  async createAccount(newAccount: AccountDTO): Promise<Account> {
    const createdAccount = new this.accountModel(newAccount);
    return await createdAccount.save();
  }

  async loginAccount(email: string, password: string): Promise<Account> {
    return await this.accountModel.findOne({ email, password }).exec();
  }

  async checkIfAccountExists(email: string): Promise<Account> {
    return await this.accountModel.findOne({ email }).exec();
  }
}
