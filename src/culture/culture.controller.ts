import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CultureService } from './culture.service';
import { plainToInstance } from 'class-transformer';
import { CultureDto } from './culture.dto/culture.dto';
import { CultureEntity } from './culture.entity/culture.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';

@Controller('cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class CultureController {
    constructor(private readonly cultureService: CultureService) {}

  @Get()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader','culture')
  async findAll() {
    return await this.cultureService.findAll();
  }

  @Get(':cultureId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('reader','culture')
  async findOne(@Param('cultureId') cultureId: string) {
    return await this.cultureService.findOne(cultureId);
  }

  @Post()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer','culture')
  async create(@Body() cultureDto: CultureDto) {
    const culture: CultureEntity = plainToInstance(CultureEntity, cultureDto);
    return await this.cultureService.create(culture);
  }

  @Put(':cultureId')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('writer','culture')
  async update(@Param('cultureId') cultureId: string, @Body() cultureDto: CultureDto) {
    const culture: CultureEntity = plainToInstance(CultureEntity, cultureDto);
    return await this.cultureService.update(cultureId, culture);
  }

  @Delete(':cultureId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('deleter','culture')
  async delete(@Param('cultureId') cultureId: string) {
    return await this.cultureService.delete(cultureId);
  }
}

