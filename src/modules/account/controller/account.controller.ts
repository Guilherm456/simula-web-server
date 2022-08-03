import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountDTO, AccountLoginDTO } from 'src/DTO/account.dto';
import { AccountService } from '../service/account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/login')
  async loginAccount(@Body() account: AccountLoginDTO): Promise<string> {
    return await this.accountService.loginAccount(
      account.email,
      account.password,
    );
  }
  @Post('/create')
  async createAccount(@Body() account: AccountDTO): Promise<string> {
    return await this.accountService.createAccount(account);
  }
}
