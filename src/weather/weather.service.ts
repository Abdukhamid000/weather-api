import type { Cache } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { HttpClient } from '@nestjs/http-client';

@Injectable()
export class WeatherService {
  constructor(
    private http: HttpClient,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getWeatherData(location: string) {
    const cachedData = await this.cacheManager.get(location);
    if (cachedData) {
      return cachedData;
    }

    const { data } = await this.http.get(`/${location}`);

    this.cacheManager.set(location, data, 60000);

    return data;
  }
}
