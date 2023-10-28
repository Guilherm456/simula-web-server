import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerServer } from 'src/loggerServer';
import { UserSchema } from './entities/user.schema';
import { UsersRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, LoggerServer],
  imports: [
    MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'norberto9@ethereal.email',
          pass: 'mEbKuGBe4t1wBSzzqn',
        },
      },
    }),

    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET}`,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
})
export class UsersModule {}
