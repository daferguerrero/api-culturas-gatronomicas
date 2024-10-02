import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CultureRestaurantService } from './culture-restaurant.service'; // Asegúrate de que el nombre del servicio es correcto
import { plainToInstance } from 'class-transformer';
import { RestaurantDto } from 'src/restaurant/restaurant.dto/restaurant.dto';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity/restaurant.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';

//@Controller('cultures')
@Controller('cultures/:cultureId/restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class CultureRestaurantController {
  constructor(private readonly cultureRestaurantService: CultureRestaurantService) {}

  @Post(':restaurantId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer')
  async addRestaurantToCulture(
    @Param('cultureId') cultureId: string,
    @Param('restaurantId') restaurantId: string
  ) {
    return await this.cultureRestaurantService.addRestaurantToCulture(cultureId, restaurantId);
  }

  @Get(':restaurantId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader','reader_single')
  async findRestaurantByCultureId(
    @Param('cultureId') cultureId: string,
    @Param('restaurantId') restaurantId: string
  ) {
    return await this.cultureRestaurantService.findRestaurantByCultureIdAndRestaurantId(cultureId, restaurantId);
  }

  @Get()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader')
  async findRestaurantsByCultureId(@Param('cultureId') cultureId: string) {
    return await this.cultureRestaurantService.findRestaurantsByCultureId(cultureId);
  }

  @Put()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer')
  async associateRestaurantsToCulture(
    @Body() restaurantsDto: RestaurantDto[], 
    @Param('cultureId') cultureId: string
  ) {
    const restaurants = plainToInstance(RestaurantEntity, restaurantsDto);
    return await this.cultureRestaurantService.associateRestaurantsToCulture(cultureId, restaurants);
  }

  @Delete(':restaurantId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('deleter')
  async removeRestaurantFromCulture(
    @Param('cultureId') cultureId: string,
    @Param('restaurantId') restaurantId: string
  ) {
    return await this.cultureRestaurantService.deleteRestaurantFromCulture(cultureId, restaurantId);
  }
}
