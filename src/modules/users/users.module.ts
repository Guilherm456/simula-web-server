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
