import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { User } from '../entity/user/user.entity';
import { UserRole } from '../entity/role/user-role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
