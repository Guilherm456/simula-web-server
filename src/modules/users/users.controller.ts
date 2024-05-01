import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FilterDTO, MiddlewareRequest } from '@types';
import { Public, Roles } from 'src/roles';
import { LocalStrategy } from '../../middleware/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import {
  RecoverPasswordDto,
  RecoverPasswordEmailDto,
} from './dto/recover-password.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @Roles('admin')
  findAll(@Query() filter: FilterDTO) {
    return this.usersService.getUsers(filter);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post('login')
  @Public()
  @UseGuards(LocalStrategy)
  async login(@Body() account: LoginDTO) {
    return await this.usersService.login(account);
  }

  @Post('/recover-password')
  @Public()
  async recoverPassword(@Body() email: RecoverPasswordEmailDto) {
    return await this.usersService.recoverPassword(email.email);
  }

  @Post('/new-password')
  @Public()
  async newPassword(@Body() newPassword: RecoverPasswordDto) {
    return await this.usersService.newPassword(
      newPassword.token,
      newPassword.newPassword,
    );
  }

  @Get('/user')
  @Roles('guest')
  async getUser(@Req() req: MiddlewareRequest) {
    return await this.usersService.getUser(req.user.id);
  }
}
