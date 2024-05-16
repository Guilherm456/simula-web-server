import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common'; // Import ModuleRef from @nestjs/common
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerServer } from 'src/loggerServer';
import { UserSchema } from './entities/user.schema';
import { UsersRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    LoggerServer,
    // {
    //   provide: getModelToken(UserSchema
    //   useValue: UserSchema,
    // },
  ],
  imports: [
    MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: `${process.env.EMAIL_HOST}`,
          port: +process.env.EMAIL_PORT,
          auth: process.env.EMAIL_USERNAME &&
            process.env.EMAIL_PASSWORD && {
              user: `${process.env.EMAIL_USERNAME}`,
              password: `${process.env.EMAIL_PASSWORD}`,
            },
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'email',
    }),

    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET}`,
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
})
export class UsersModule {}
