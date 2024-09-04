import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {ApiTags} from "@nestjs/swagger";
import {SignUpDto} from "./dto/signUp.dto";
import {SignInDto} from "./dto/signIn.dto";

@ApiTags("auth")
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@Post("signUp")
	signUp(@Body() signUpDto: SignUpDto) {
		return this.authService.signUp(signUpDto);
	}

	@Post("signIn")
	signIn(@Body() signInDto: SignInDto) {
		return this.authService.signIn(signInDto);
	}
}
