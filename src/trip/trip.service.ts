import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderTrip } from '../entity/order-trip/order-trip.entity';
import { Trip } from '../entity/trip/trip.entity';
import { User } from '../entity/user/user.entity';
import { CreateOrderDto } from './dto/trip.dto';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(OrderTrip)
    private orderTripRepository: Repository<OrderTrip>,
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createOrder(
    orderData: CreateOrderDto,
    userEmail: string,
  ): Promise<{ status: number; message: string; data: any; error: boolean }> {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'User tidak ditemukan',
          error: true,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const tripId = `TR_${Date.now()}`;

    const price = orderData.numberOfPeople * 20000;

    const trip = new Trip();
    trip.id = tripId;
    trip.startLocation = orderData.startLocation;
    trip.endLocation = orderData.endLocation;
    trip.numberOfPeople = orderData.numberOfPeople;
    trip.price = price;

    await this.tripRepository.save(trip);

    const orderTrip = new OrderTrip();
    orderTrip.trip = trip;
    orderTrip.user = user;
    orderTrip.status = 'pending';

    try {
      await this.orderTripRepository.save(orderTrip);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Gagal menyimpan order trip',
          error: true,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Membuat response sesuai template
    return {
      status: HttpStatus.CREATED,
      message: 'Order successfully created',
      data: {
        tripId: trip.id,
        email: user.email,
        startLocation: trip.startLocation,
        endLocation: trip.endLocation,
        price: trip.price,
        status: orderTrip.status,
      },
      error: false,
    };
  }

  async cancelOrder(
    tripId: string,
    userEmail: string,
  ): Promise<{ status: number; message: string; data: any; error: boolean }> {
    const orderTrip = await this.orderTripRepository.findOne({
      where: {
        trip: { id: tripId },
        status: 'pending',
      },
      relations: ['trip', 'user'],
    });

    if (!orderTrip) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Order not found or not in pending status',
          error: true,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Now it's safe to check the user's email
    if (orderTrip.user.email !== userEmail) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'You are not authorized to cancel this order',
          error: true,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    orderTrip.status = 'cancelled';
    await this.orderTripRepository.save(orderTrip);

    return {
      status: HttpStatus.OK,
      message: 'Order has been cancelled successfully',
      data: {
        tripId: orderTrip.trip.id,
        email: userEmail,
        startLocation: orderTrip.trip.startLocation,
        endLocation: orderTrip.trip.endLocation,
        price: orderTrip.trip.price,
        status: orderTrip.status,
      },
      error: false,
    };
  }

  async getOrderStatus(
    userEmail: string,
  ): Promise<{ status: number; message: string; data: any; error: boolean }> {
    try {
      const orderTrips = await this.orderTripRepository.find({
        where: { user: { email: userEmail } },
        relations: ['trip', 'user', 'driver'],
      });

      if (orderTrips.length === 0) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Order trips not found for the user',
          data: null,
          error: true,
        };
      }

      const responseData = orderTrips.map((orderTrip) => {
        const orderData: any = {
          tripId: orderTrip.trip.id,
          email: userEmail,
          startLocation: orderTrip.trip.startLocation,
          endLocation: orderTrip.trip.endLocation,
          price: orderTrip.trip.price,
          status: orderTrip.status,
        };

        if (orderTrip.status === 'accepted' && orderTrip.driver) {
          orderData.driver = {
            email: orderTrip.driver.email,
            name: orderTrip.driver.name,
          };
        }

        return orderData;
      });

      return {
        status: HttpStatus.OK,
        message: 'Order status retrieved successfully',
        data: responseData,
        error: false,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while retrieving order status',
          error: true,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async viewPendingOrders(): Promise<{
    status: number;
    message: string;
    data: any;
    error: boolean;
  }> {
    try {
      const pendingOrders = await this.orderTripRepository.find({
        where: { status: 'pending' },
        relations: ['trip', 'user'],
      });

      if (pendingOrders.length === 0) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'No pending orders found',
          data: null,
          error: true,
        };
      }

      const responseData = pendingOrders.map((order) => ({
        orderId: order.id,
        tripId: order.trip.id,
        userEmail: order.user.email,
        startLocation: order.trip.startLocation,
        endLocation: order.trip.endLocation,
        price: order.trip.price,
        status: order.status,
      }));

      return {
        status: HttpStatus.OK,
        message: 'Pending orders retrieved successfully',
        data: responseData,
        error: false,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while retrieving pending orders',
          error: true,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async acceptOrder(
    tripId: string,
    driverEmail: string,
  ): Promise<{ status: number; message: string; data: any; error: boolean }> {
    const order = await this.orderTripRepository.findOne({
      where: { trip: { id: tripId }, status: 'pending' },
      relations: ['trip', 'user'],
    });

    if (!order) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Order not found or not in pending status',
          error: true,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const driver = await this.userRepository.findOne({
      where: { email: driverEmail },
    });

    if (!driver) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Driver not found',
          error: true,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    order.status = 'accepted';
    order.driver = driver;

    await this.orderTripRepository.save(order);

    return {
      status: HttpStatus.OK,
      message: 'Order has been accepted successfully',
      data: {
        orderId: order.id,
        tripId: order.trip.id,
        driverId: driver.id,
        driverEmail: driver.email,
        driverName: driver.name,
        status: order.status,
      },
      error: false,
    };
  }

  async revertOrderStatus(
    tripId: string,
    driverEmail: string,
  ): Promise<{ status: number; message: string; data: any; error: boolean }> {
    const order = await this.orderTripRepository.findOne({
      where: { trip: { id: tripId }, status: 'accepted' },
      relations: ['trip', 'driver'],
    });

    if (!order) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Accepted order not found',
          error: true,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (order.driver.email !== driverEmail) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'You are not authorized to revert the status of this order',
          error: true,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    order.status = 'pending';
    order.driver = null;
    await this.orderTripRepository.save(order);

    return {
      status: HttpStatus.OK,
      message: 'Order status has been reverted to pending successfully',
      data: {
        orderId: order.id,
        tripId: order.trip.id,
        status: order.status,
      },
      error: false,
    };
  }
}
