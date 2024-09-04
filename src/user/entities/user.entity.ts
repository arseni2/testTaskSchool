import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity("user")
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	firstName: string

	@Column({nullable: true})
	middleName: string

	@Column()
	lastName: string

	@Column()
	password: string

	@Column({length: "12"})
	telephone: string

	@Column({unique: true})
	email: string

	@ManyToOne(() => UserEntity, user => user.referrals, { nullable: true })
	referrer: UserEntity

	@OneToMany(() => UserEntity, user => user.referrer)
	referrals: UserEntity[]

	@Column({default: 0})
	lesson: number
}
