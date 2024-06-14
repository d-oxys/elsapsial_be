import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private failedLoginAttempts = 0;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async loginWithEmail(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'User does not exist',
          error: true,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      this.failedLoginAttempts++;
      if (this.failedLoginAttempts >= 5) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            message:
              'You have reached the maximum number of login attempts. Please try again later.',
            error: true,
          },
          HttpStatus.FORBIDDEN,
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid email or password',
          error: true,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.failedLoginAttempts = 0;

    const role = user.role?.role_name;

    const payload = {
      username: user.email,
      sub: user.id,
      role: role,
    };

    return {
      status: HttpStatus.OK,
      message: 'logged in successfully',
      user: {
        name: user.name,
        email: user.email,
        role: role,
        token: this.jwtService.sign(payload),
      },
      error: false,
    };
  }
}
