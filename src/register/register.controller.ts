// register.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDto, RegisterRoleDto } from './dto/register.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register/role')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Please add role user and driver first' })
  @ApiBody({ type: RegisterRoleDto })
  async registerRole(@Body('name') roleName: string) {
    return this.registerService.registerRole(roleName);
  }

  @Post('register/user')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({ summary: 'register a new user' })
  @ApiResponse({ status: 201, description: 'User registration successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterUserDto })
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.registerService.register(registerUserDto);
  }

  @Get('get/users')
  @ApiOperation({ summary: 'get all user data' })
  async findAll() {
    return this.registerService.findAll();
  }

  @Get('get/roles')
  @ApiOperation({ summary: 'get all role data' })
  async findAllRoles() {
    return this.registerService.findAllRoles();
  }
}
