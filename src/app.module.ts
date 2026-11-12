import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpClientModule } from '@nestjs/http-client';
import { ThrottlerModule } from '@nestjs/throttler';
import { WeatherModule } from './weather/weather.module.js';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    HttpClientModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (config: ConfigService) => ({
        baseUrl: config.getOrThrow('WEATHER_BASE_URL'),
      }),
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      async useFactory(config: ConfigService) {
        const redisStore = createKeyv(
          `redis://:${config.getOrThrow('REDIS_PASSWORD')}@localhost:6379`,
        );
        redisStore.on('error', (err) => console.error('Redis error:', err));

        return {
          stores: [redisStore],
        };
      },
    }),
    WeatherModule,
  ],
})
export class AppModule {}
