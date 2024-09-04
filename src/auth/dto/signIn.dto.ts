import {ApiProperty, ApiTags} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class SignInDto {
	@IsNotEmpty({message: "поле не может быть пустым"})
	@IsString({message: "поле должно быть строкой"})
	@IsEmail({}, {message: "не коректный email"})
	@ApiProperty()
	email: string

	@IsNotEmpty({message: "поле не может быть пустым"})
	@IsString({message: "поле должно быть строкой"})
	@ApiProperty()
	password: string
}