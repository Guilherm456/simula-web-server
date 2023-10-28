import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public, Roles } from 'src/roles';
import { LocalStrategy } from './auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.usersService.remove(+id);
  }

  @Post('login')
  @Public()
  @UseGuards(LocalStrategy)
  async login(@Body() account: LoginDTO) {
    return await this.usersService.login(account);
  }

  @Get('/recover-password/:email')
  async recoverPassword(@Param('email') email: string) {
    return await this.usersService.recoverPassword(email);
  }

  @Post('/new-password/:token')
  async newPassword(
    @Param('token') token: string,
    @Body() newPassword: RecoverPasswordDto,
  ) {
    return await this.usersService.newPassword(token, newPassword.newPassword);
  }
}
