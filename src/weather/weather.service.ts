import type { Cache } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpClient } from '@nestjs/http-client';

@Injectable()
export class WeatherService {
  private logger = new Logger(WeatherService.name);
  constructor(
    private http: HttpClient,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getWeatherData(location: string) {
    const cachedData = await this.cacheManager.get(location);
    if (cachedData) {
      return cachedData;
    }

    try {
      const { data } = await this.http.get(`/${location}`);

      this.cacheManager.set(location, data, 60000);

      return data;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
