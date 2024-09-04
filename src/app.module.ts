import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ormconfig} from "./config/orm.config";
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {redisConfig} from "./config/redis.config";
import {RedisModule} from "@liaoliaots/nestjs-redis";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync(ormconfig),
		RedisModule.forRoot({
			config: {
				host: 'localhost', // замените на нужный адрес
				port: 6379,        // замените на нужный порт
				password: 'admin', // если используется
				maxRetriesPerRequest: 50, // увеличьте лимит попыток
				connectTimeout: 10000,    // временный таймаут подключения
			},
		}),
		UserModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
