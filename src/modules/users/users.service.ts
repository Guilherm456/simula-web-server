import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as brycpt from 'bcrypt';
import { randomUUID } from 'crypto';
import { LoggerServer } from 'src/loggerServer';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService {
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
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const emailExists = await this.userRepository.getUserByEmail(
      createUserDto.email,
    );

    if (emailExists)
      throw new HttpException('Email já cadastrado', HttpStatus.BAD_REQUEST);
    try {
      const saltPassword = brycpt.genSaltSync(
        Number(process.env.SIZE_PASSWORD_HASH),
      );
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
      sub: account.password,
      role: user.role,
      id: user._id,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1d',
      }),
    };
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

    const newToken = randomUUID();

    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'simulaweb@noreply.com',

        subject: 'Recuperação de senha (não responder)',
        text: `Olá ${user.name}, você solicitou a recuperação de senha, para continuar clique no link abaixo: \n\n ${process.env.CORS_ORIGIN}/recover-password/${newToken} \n\n Caso não tenha sido você, ignore este email.`,
      });

      this.tokens.set(newToken, {
        userID: user._id,
        expires: new Date().getTime() + 600000,
      });
      setTimeout(() => {
        this.tokens.delete(newToken);
      }, 600000);
      return true;
    } catch (err) {
      if (this.tokens.has(newToken)) this.tokens.delete(newToken);
      this.logger.error(err);
      throw new HttpException('Erro ao enviar email', HttpStatus.BAD_REQUEST);
    }
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

    const saltPassword = brycpt.genSaltSync(
      Number(process.env.SIZE_PASSWORD_HASH),
    );
    const newPasswordHash = brycpt.hashSync(newPassword, saltPassword);
    await this.updateColumn(user._id, 'password', newPasswordHash);

    this.tokens.delete(token);

    return true;
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.getUserByEmail(email);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async updateColumn(id: string, column: string, value: any) {
    return await this.userRepository.updateColumn(id, column, value);
  }
}
