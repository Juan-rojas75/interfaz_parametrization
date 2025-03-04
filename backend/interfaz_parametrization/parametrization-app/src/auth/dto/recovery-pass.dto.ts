import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RecoveryPassDto {

    @ApiProperty({ 
    example: 'Email@email.com',
    description: 'The email of the User',
    type: String
    })
    @IsEmail()
    email: string;
    

    @ApiProperty({ 
    example: 'password',
    description: 'The password of the User',
    type: String
    })
    @IsString()
    password: string;

    @ApiProperty({ 
    example: 'password',
    description: 'The password of the User',
    type: String
    })
    @IsString()
    password_confirm: string;
}
