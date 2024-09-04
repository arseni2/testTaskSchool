import {Body, Controller, Get, Param, Patch, Post, Request, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../auth/guards/AuthGuard";
import {RequestWithUser} from "../types";
import {PaymentDto} from "./dto/payment.dto";

@ApiTags("user")
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {
	}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@Get('/statistics')
	async getReferralStatistics(@Request() req: RequestWithUser) {
		return this.userService.getReferralStatistics(req.user.id);
	}

	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@Post("payment")
	payment(@Body() dto: PaymentDto, @Request() req: RequestWithUser) {
		return this.userService.payment(dto, req.user.id)
	}

	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@Get("/link")
	findAll(
		@Request() req: RequestWithUser
	) {
		return this.userService.generateLink(req.user.id);
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	@Get('me')
	me(
		@Request() req: RequestWithUser
	) {
		return this.userService.me(req.user.id);
	}

	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	@Patch()
	update(@Request() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(req.user.id, updateUserDto);
	}
}
