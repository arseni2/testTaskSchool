import {BadRequestException, Injectable} from '@nestjs/common';
import {SignUpDto} from "./dto/signUp.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {SignInDto} from "./dto/signIn.dto";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UserService,
		private readonly jwtService: JwtService
	) {
	}

	async signUp(signUpDto: SignUpDto) {
		const user = await this.usersService.findByEmail(signUpDto.email)
		if(user) throw new BadRequestException("email уже используется")
		const newUser = await this.usersService.create(signUpDto)
		const payload = {id: newUser.id}
		const accessToken = await this.jwtService.signAsync(payload)

		return {newUser, accessToken}
	}

	async signIn(signInDto: SignInDto) {
		const user = await this.usersService.findByEmail(signInDto.email)
		if(!user) throw new BadRequestException("не правильный email или пароль")

		const isMatch = await bcrypt.compare(signInDto.password, user.password);
		if(!isMatch) throw new BadRequestException("не правильный email или пароль")

		const payload = {id: user.id}
		const accessToken = await this.jwtService.signAsync(payload)

		return {user, accessToken}
	}
}
