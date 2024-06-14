// register.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user/user.entity';
import { UserRole } from '../entity/role/user-role.entity';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async registerRole(roleName: string) {
    if (!roleName) {
      throw new HttpException('Role name is required', HttpStatus.BAD_REQUEST);
    }

    const roleExists = await this.userRoleRepository.findOne({
      where: { role_name: roleName },
    });
    if (roleExists) {
      throw new HttpException('Role already exists', HttpStatus.CONFLICT);
    }

    const newRole = this.userRoleRepository.create({
      role_name: roleName,
    });

    await this.userRoleRepository.save(newRole);

    return {
      status: HttpStatus.CREATED,
      message: 'Role added successfully',
      error: false,
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const { name, email, password, roleName } = registerUserDto;

    const role = await this.userRoleRepository.findOne({
      where: { role_name: roleName },
    });

    if (!role) {
      throw new HttpException('Role does not exist', HttpStatus.BAD_REQUEST);
    }

    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await this.userRepository.save(newUser);

    return {
      status: HttpStatus.CREATED,
      message: 'Register successfully',
      error: false,
    };
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'password', 'name'],
      relations: ['role'],
    });
  }

  async findAllRoles(): Promise<UserRole[]> {
    return await this.userRoleRepository.find({
      select: ['id', 'role_name'],
    });
  }
}
