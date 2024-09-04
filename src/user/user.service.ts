import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {Repository} from "typeorm";
import {UserEntity} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';
import {PaymentDto} from "./dto/payment.dto";
import Redis from "ioredis";
import {InjectRedis} from "@liaoliaots/nestjs-redis";

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name)
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepo: Repository<UserEntity>,

		@InjectRedis() private readonly redis: Redis
	) {
	}

	async getReferralStatistics(referrerId: number) {
		this.logger.log(`Запрос статистики рефералов для пользователя с id: ${referrerId}`);

		const cachedStats = await this.redis.get(`referralStats:${referrerId}`);
		if (cachedStats) {
			this.logger.log(`Статистика найдена в кэше: ${cachedStats}`);
			return JSON.parse(cachedStats);
		}

		const user = await this.userRepo.findOne({
			where: { id: referrerId },
			relations: { referrals: true }
		});

		if (!user) throw new BadRequestException("Некорректный id");

		const referralStats = {
			totalInvited: user.referrals.length,
			activeStudents: user.referrals.filter(referral => referral.lesson > 0).length,
			referrals: user.referrals.map(referral => ({
				id: referral.id,
				name: `${referral.firstName} ${referral.lastName}`,
			})),
		};

		await this.redis.set(`referralStats:${referrerId}`, JSON.stringify(referralStats), 'EX', 3600);
		this.logger.log(`Статистика сохранена в кэше: ${JSON.stringify(referralStats)}`);

		return referralStats;
	}

	async create(createUserDto: CreateUserDto) {
		this.logger.log(`Создание пользователя с email: ${createUserDto.email}`);
		let userReferral: UserEntity | null;
		if (createUserDto.referrer) {
			userReferral = await this.userRepo.findOne({where: {id: createUserDto.referrer}, transaction: false})
			if (!userReferral) throw new BadRequestException("referral некоректный")
			return this.userRepo.save({...createUserDto, referrer: {id: userReferral.id}})
		}
		createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
		return this.userRepo.save({...createUserDto, referrer: null })
	}

	async generateLink(id: number) {
		this.logger.log(`Генерация ссылки для пользователя с id: ${id}`);

		const cachedLink = await this.redis.get(`referralLink:${id}`);
		if (cachedLink) {
			this.logger.log(`Ссылка найдена в кэше: ${cachedLink}`);
			return cachedLink;
		}

		const user = await this.userRepo.findOne({ where: { id }, transaction: false });
		if (!user) throw new BadRequestException("Некорректный id");

		const referralLink = `https://exampleDomain/signUp?referralCode=${user.id}`;

		await this.redis.set(`referralLink:${id}`, referralLink, 'EX', 3600);
		this.logger.log(`Ссылка сохранена в кэше: ${referralLink}`);

		return referralLink;
	}

	async findByEmail(email: string) {
		this.logger.log(`Поиск пользователя с email: ${email}`);

		const cachedUser = await this.redis.get(email);
		if (cachedUser) {
			this.logger.log(`Пользователь найден в кэше: ${cachedUser}`);
			return JSON.parse(cachedUser);
		}

		const user = await this.userRepo.findOne({ where: { email }, transaction: false });

		if (user) {
			await this.redis.set(email, JSON.stringify(user), 'EX', 3600);
			this.logger.log(`Пользователь сохранён в кэше: ${user}`);
		}

		return user;
	}

	async me(id: number) {
		this.logger.log(`Запрос информации о пользователе с id: ${id}`);

		const cacheKey = `user:${id}`;
		const cachedUser = await this.redis.get(cacheKey);

		if (cachedUser) {
			this.logger.log(`Возвращаем данные из кэша для пользователя с id: ${id}`);
			return JSON.parse(cachedUser);
		}

		const user = await this.userRepo.findOne({ where: { id }, transaction: false });
		if (!user) throw new BadRequestException("Пользователь не найден");

		await this.redis.set(cacheKey, JSON.stringify(user), 'EX', 3600);

		return user;
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		this.logger.log(`Обновление пользователя с id: ${id}`);
		if(updateUserDto.password) {
			updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
		}
		return await this.userRepo.update(id, {
			password: updateUserDto.password,
			email: updateUserDto.email,
			lastName: updateUserDto.lastName,
			firstName: updateUserDto.firstName,
			middleName: updateUserDto.middleName,
			telephone: updateUserDto.telephone
		})
	}

	async payment(dto: PaymentDto, id: number) {
		this.logger.log(`Обработка платежа для пользователя с id: ${id}`);
		const user = await this.userRepo.findOne({where: {id}, transaction: false, relations: {referrals: true}})
		user.lesson += 4
		const users = user.referrals.map((user) => {
			user.lesson += 4
			return user
		})
		this.logger.log(`Платеж обработан для пользователя с id ${id}, увеличено количество уроков.`);
		return await this.userRepo.save([user, ...users])
	}
}
