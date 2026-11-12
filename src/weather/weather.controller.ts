import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service.js';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':city')
  getWeatherData(@Param('city') location: string) {
    return this.weatherService.getWeatherData(location);
  }
}
