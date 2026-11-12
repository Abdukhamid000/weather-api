# Weather API Wrapper Service

A NestJS service that fetches weather data for a city from Visual Crossing and caches responses in Redis.

**Roadmap.sh project:** [Weather API Wrapper Service](https://roadmap.sh/projects/weather-api-wrapper-service)

## Requirements

- Node.js
- pnpm
- Docker with the Docker Compose plugin
- A Visual Crossing API key

## Configuration

Install dependencies and create your local environment file:

```bash
pnpm install
cp .env.example .env
```

Set `REDIS_PASSWORD` in `.env` to a non-empty password. The Compose service uses this password to protect Redis, and the application uses it to connect. The application currently connects to Redis on `localhost:6379`.

The `.env.example` file also includes `PORT` and `WEATHER_BASE_URL`. The weather service uses `WEATHER_BASE_URL` as its upstream base URL.

> **Note:** `WEATHER_API_KEY` is present in the environment template, but the current implementation does not add it to upstream requests. Visual Crossing may reject requests until API-key handling is implemented.

## Run the service

Start Redis:

```bash
docker compose up -d redis
```

Start the API in development mode:

```bash
pnpm run start:dev
```

The API listens on port `8080` by default. Request weather data for a city with:

```bash
curl http://localhost:8080/weather/London
```

The city is sent to the configured weather provider, and successful responses are cached in Redis for 60 seconds.

Stop Redis when you are finished:

```bash
docker compose down
```

## Other commands

```bash
# Build
pnpm run build

# Run the compiled application
pnpm run start:prod

# Run tests
pnpm run test
pnpm run test:e2e
```
