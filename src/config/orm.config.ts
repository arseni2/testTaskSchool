import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModuleAsyncOptions} from '@nestjs/typeorm';

export const ormconfig: TypeOrmModuleAsyncOptions = {
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: async (config: ConfigService) => ({
		type: 'postgres',
		host: process.env.TYPEORM_HOST,
		username: process.env.TYPEORM_USERNAME,
		password: process.env.TYPEORM_PASSWORD,
		database: process.env.TYPEORM_DATABASE,
		port: +process.env.TYPEORM_PORT,
		entities: [__dirname + 'src/**/*.entity{.ts,.js}'],
		synchronize: true,
		autoLoadEntities: true,
		logging: true,
	}),
};