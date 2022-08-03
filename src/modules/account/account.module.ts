import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountRepository } from 'src/Mongo/repository/account.repository';

import { AccountSchema } from 'src/Mongo/Schemas/account.schemas';
import { AccountController } from './controller/account.controller';
import { AccountService } from './service/account.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'account', schema: AccountSchema }]),
  ],

  exports: [AccountService],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
})
export class AccountModule {}
