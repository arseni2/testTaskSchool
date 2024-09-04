import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsOptional, IsMobilePhone, IsNumber, IsString} from "class-validator";

export class CreateUserDto {
	@IsString({message: "поле должно быть строкой"})
	@IsNotEmpty({message: "поле не может быть пустым"})
	@ApiProperty({
		description: "имя человека"
	})
	firstName: string

	@IsString({message: "поле должно быть строкой"})
	@IsOptional()
	@ApiProperty({
		description: "отчество человека",
		nullable: true
	})
	middleName?: string

	@IsString({message: "поле должно быть строкой"})
	@IsNotEmpty({message: "поле не может быть пустым"})
	@ApiProperty({
		description: "фамилия человека"
	})
	lastName: string

	@IsString({message: "поле должно быть строкой"})
	@IsNotEmpty({message: "поле не может быть пустым"})
	@ApiProperty({
		description: "фамилия человека"
	})
	password: string

	@IsString({message: "поле должно быть строкой"})
	@IsNotEmpty({message: "поле не может быть пустым"})
	@IsEmail({}, {message: "почта не правильная"})
	@ApiProperty({description: "почта человека"})
	email: string

	@IsString({message: "поле должно быть строкой"})
	@IsMobilePhone("ru-RU", {}, {message: "телефон не коректный"})
	@IsNotEmpty({message: "поле не может быть пустым"})
	@ApiProperty({description: "телефон человека"})
	telephone: string

	@IsOptional()
	@IsNumber()
	@ApiProperty({description: "приглашение от другого пользователя"})
	referrer?: number
}
