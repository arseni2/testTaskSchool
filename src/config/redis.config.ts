import { ConfigModule, ConfigService } from '@nestjs/config';
import {RedisModuleAsyncOptions} from "@liaoliaots/nestjs-redis";

export const redisConfig: RedisModuleAsyncOptions = {
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: async (config: ConfigService) => ({
		config: {
			host: config.get<string>('REDIS_HOST'),
			port: +config.get<number>('REDIS_PORT'),
			password: config.get<string>('REDIS_PASSWORD') || undefined,
		}
	}),
};