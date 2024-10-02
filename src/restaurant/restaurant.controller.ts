import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestaurantService } from './restaurant.service';
import { plainToInstance } from 'class-transformer';
import { RestaurantDto } from './restaurant.dto/restaurant.dto';
import { RestaurantEntity } from './restaurant.entity/restaurant.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader')
  async findAll() {
    return await this.restaurantService.findAll();
  }

  @Get(':restaurantId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader','reader_single')
  async findOne(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantService.findOne(restaurantId);
  }

  @Post()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer')
  async create(@Body() restaurantDto: RestaurantDto) {
    const restaurant: RestaurantEntity = plainToInstance(RestaurantEntity, restaurantDto);
    return await this.restaurantService.create(restaurant);
  }

  @Put(':restaurantId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer')
  async update(@Param('restaurantId') restaurantId: string, @Body() restaurantDto: RestaurantDto) {
    const restaurant: RestaurantEntity = plainToInstance(RestaurantEntity, restaurantDto);
    return await this.restaurantService.update(restaurantId, restaurant);
  }

  @Delete(':restaurantId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('deleter')
  async delete(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantService.delete(restaurantId);
  }
}
