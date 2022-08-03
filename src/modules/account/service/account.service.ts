import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountDTO } from 'src/DTO/account.dto';
import { AccountRepository } from 'src/Mongo/repository/account.repository';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async createAccount(account: AccountDTO): Promise<string> {
    if (await this.checkIfAccountExists(account.email)) {
      throw new HttpException('E-mail em uso', HttpStatus.BAD_REQUEST);
    }
    const accountCreated = await this.accountRepository.createAccount(account);
    if (accountCreated) {
      return accountCreated._id.toString();
    } else {
      throw new HttpException('Erro ao criar a conta', HttpStatus.BAD_REQUEST);
    }
  }

  async loginAccount(email: string, password: string): Promise<string> {
    const account = await this.accountRepository.loginAccount(email, password);
    if (account) {
      return account._id.toString();
    } else {
      throw new HttpException(
        'E-mail ou senha inválidos',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async checkIfAccountExists(email: string): Promise<boolean> {
    const account = await this.accountRepository.checkIfAccountExists(email);
    if (account) {
      return true;
    } else {
      return false;
    }
  }

  async checkPrivilege(accountID: string, privilege: string): Promise<boolean> {
    return false;
  }
}
