import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CityRestaurantService } from './city-restaurant.service';
import { RestaurantDto } from 'src/restaurant/restaurant.dto/restaurant.dto';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity/restaurant.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';

@Controller('city/:cityId/restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class CityRestaurantController {

    constructor(private readonly cityRestaurantService: CityRestaurantService) {}

    @Post(':restaurantId')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('writer')
    async addRestaurantToCity(
        @Param('cityId') cityId: string,
        @Param('restaurantId') restaurantId: string
    ) {
        return await this.cityRestaurantService.addRestaurantToCity(cityId, restaurantId);
    }

    @Get(':restaurantId')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('reader_single','reader')
    async findRestaurantByCityId(
        @Param('cityId') cityId: string,
        @Param('restaurantId') restaurantId: string
    ) {
        return await this.cityRestaurantService.findRestaurantByCityIdAndRestaurantId(cityId, restaurantId);
    }

    @Get()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('reader')
    async findRestaurantsByCityId(@Param('cityId') cityId: string) {
        return await this.cityRestaurantService.findRestaurantsByCityId(cityId);
    }

    @Put()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('writer')
    async associateRestaurantsToCity(
        @Body() restaurants: RestaurantEntity[], 
        @Param('cityId') cityId: string
    ) {
        return await this.cityRestaurantService.associateRestaurantsToCity(cityId, restaurants);
    }
    
    @Delete(':restaurantId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('deleter')
    async removeRestaurantFromCity(
        @Param('cityId') cityId: string,
        @Param('restaurantId') restaurantId: string
    ) {
        return await this.cityRestaurantService.deleteRestaurantFromCity(cityId, restaurantId);
    }
    

}
