/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt.authGuard';
import { TripService } from './trip.service';
import { CreateOrderDto, AcceptOrderDto } from './dto/trip.dto';
import { User } from '../entity/user/user.entity';
import { Driver } from '../entity/driver/driver.entity';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/guard/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order creation successful',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateOrderDto })
  @ApiBearerAuth()
  async createOrder(@Body() orderData: CreateOrderDto, @Req() req) {
    const user = req.user.username;
    return this.tripService.createOrder(orderData, user);
  }

  @Delete(':tripId/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancellation successful' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiParam({
    name: 'tripId',
    type: 'string',
    description: 'Unique identifier of the trip order to cancel',
  })
  @ApiBearerAuth()
  async cancelOrder(@Param('tripId') tripId: string, @Req() req) {
    const userEmail = req.user.username;
    return this.tripService.cancelOrder(tripId, userEmail);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get order status' })
  @ApiResponse({
    status: 200,
    description: 'Order status retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiBearerAuth()
  getOrderStatus(@Req() req) {
    return this.tripService.getOrderStatus(req.user.username);
  }

  @Get('avaible-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('driver')
  @ApiOperation({ summary: 'View available orders for drivers' })
  @ApiResponse({
    status: 200,
    description: 'Available orders retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  async viewPendingOrders(@Req() req) {
    return this.tripService.viewPendingOrders();
  }

  @Patch(':tripId/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('driver')
  @ApiOperation({ summary: 'Accept an order by a driver' })
  @ApiResponse({ status: 200, description: 'Order accepted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiParam({
    name: 'tripId',
    type: 'string',
    description: 'Unique identifier of the trip order to accept',
  })
  @ApiBearerAuth()
  async acceptOrder(@Param('tripId') tripId: string, @Req() req) {
    const driverEmail = req.user.username;
    return this.tripService.acceptOrder(tripId, driverEmail);
  }

  @Patch(':tripId/unaccept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('driver')
  @ApiOperation({
    summary: 'Revert the status of an accepted order back to pending',
  })
  @ApiResponse({
    status: 200,
    description: 'Order status reverted successfully',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiParam({
    name: 'tripId',
    type: 'string',
    description: 'Unique identifier of the trip order to revert',
  })
  @ApiBearerAuth()
  async revertOrderStatus(@Param('tripId') tripId: string, @Req() req) {
    const driverEmail = req.user.username;
    return this.tripService.revertOrderStatus(tripId, driverEmail);
  }
}
