import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";

export class PaymentDto {
	@IsNumber({}, {message: "поле должно быть числом"})
	@IsNotEmpty({message: "поле не должно быть пустым"})
	@ApiProperty()
	money: number
}