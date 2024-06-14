import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { Trip } from '../entity/trip/trip.entity';
import { OrderTrip } from '../entity/order-trip/order-trip.entity';
import { User } from '../entity/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, OrderTrip, User])],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
