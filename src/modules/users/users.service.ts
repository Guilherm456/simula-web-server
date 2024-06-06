import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FilterDTO } from '@types';
import * as brycpt from 'bcrypt';
import { Job, Queue } from 'bull';
import { randomUUID } from 'crypto';
import { LoggerServer } from 'src/loggerServer';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './user.repository';

@Processor('email')
@Injectable()
export class UsersService implements OnModuleInit {
  private tokens = new Map<
    string,
    {
      userID: string;
      expires: number;
    }
  >();
  constructor(
    private jwtService: JwtService,
    private readonly userRepository: UsersRepository,
    private mailerService: MailerService,
    private logger: LoggerServer,
    @InjectQueue('email') private readonly emailQueue: Queue<User>,
  ) {}

  // Gera um usuário admin caso não exista
  async onModuleInit() {
    const users = await this.userRepository.getUsers();

    if (!users.totalElements) {
      const randomPassword = randomUUID();
      await this.createUser({
        name: 'Admin',
        email: 'admin@simula.com',
        role: 'admin',
        password: randomPassword,
      });

      console.log(
        `Usuário admin criado com a senha ${randomPassword} e email 'admin@simula.com'`,
      );
    }
  }

  async getUser(id: string) {
    const user = await this.userRepository.getUser(id);
    if (!user || !id)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    return user;
  }
  async createUser(createUserDto: CreateUserDto) {
    const emailExists = await this.userRepository.getUserByEmail(
      createUserDto.email,
    );

    if (emailExists)
      throw new HttpException('Email já cadastrado', HttpStatus.BAD_REQUEST);
    try {
      const saltPassword = brycpt.genSaltSync(+process.env.SIZE_PASSWORD_HASH);
      const newPassword = brycpt.hashSync(createUserDto.password, saltPassword);
      await this.userRepository.createUser({
        ...createUserDto,
        password: newPassword,
      } as User);
      this.logger.log('Usuário criado com sucesso');
      return true;
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('Erro ao criar usuário', HttpStatus.BAD_REQUEST);
    }
  }

  async getUsers(filters?: FilterDTO) {
    return await this.userRepository.getUsers(filters);
  }

  async login(account: LoginDTO) {
    const user = await this.userRepository.getUserByEmail(account.email);

    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    const passwordIsValid = await brycpt.compare(
      account.password,
      user.password,
    );

    if (!passwordIsValid)
      throw new HttpException('Senha incorreta', HttpStatus.BAD_REQUEST);

    const payload = {
      email: account.email,
      role: user.role,
      id: user._id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      maxAge: 604800,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Process()
  async sendRecoverPassword(job: Job<User>) {
    const user = job.data;

    const newToken = randomUUID();

    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: `${process.env.EMAIL_FROM}`,
        subject: 'Recuperação de senha (não responder)',
        text: `Olá ${user.name}, você solicitou a recuperação de senha, para continuar clique no link abaixo: \n\n ${process.env.CORS_ORIGIN}/recuperar-senha/${newToken} \n\n Caso não tenha sido você, ignore este email.`,
      });

      this.tokens.set(newToken, {
        userID: user._id,
        expires: new Date().getTime() + 600000,
      });
      setTimeout(() => {
        this.tokens.delete(newToken);
      }, 600000);
    } catch (err) {
      if (this.tokens.has(newToken)) this.tokens.delete(newToken);
      this.logger.error(err);
      throw new HttpException(
        'Erro ao enviar email de recuperação de senha',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async recoverPassword(email: string) {
    if (this.tokens.size >= 5000)
      throw new HttpException(
        'Limite de tokens excedido',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.userRepository.getUserByEmail(email);
    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    await this.emailQueue.add(user);
  }

  async newPassword(token: string, newPassword: string) {
    const tokenData = this.tokens.get(token);
    if (!tokenData)
      throw new HttpException('Token inválido', HttpStatus.BAD_REQUEST);

    if (tokenData.expires < new Date().getTime()) {
      this.tokens.delete(token);
      throw new HttpException('Token expirado', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.getUser(tokenData.userID);
    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    const saltPassword = brycpt.genSaltSync(+process.env.SIZE_PASSWORD_HASH);
    const newPasswordHash = brycpt.hashSync(newPassword, saltPassword);
    await this.updateColumn(user._id, 'password', newPasswordHash);

    this.tokens.delete(token);

    return true;
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.getUserByEmail(email);
  }

  async deleteUser(id: string) {
    return await this.userRepository.deleteUser(id);
  }

  async updateColumn(id: string, column: string, value: any) {
    return await this.userRepository.updateColumn(id, column, value);
  }
}
