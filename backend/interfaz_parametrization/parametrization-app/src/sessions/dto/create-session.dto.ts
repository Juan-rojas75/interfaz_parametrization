import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";
import { User } from "src/User/db/model/user.model";

export class CreateSessionDto {

    @ApiProperty({ 
        example: 'ID user',
        description: 'The id of the user',
        type: Types.ObjectId,
        required: true
    })
    @IsNotEmpty()
    user: User | Types.ObjectId;

    @ApiProperty({ 
      example: 'acces_token',
      description: 'The access token of the session',
      type: String
    })
    @IsNotEmpty()
    accessToken: string

    @ApiProperty({ 
      example: 'refresh_token',
      description: 'The refresh token of the session',
      type: String
    })
    @IsOptional()
    refreshToken: string

    @ApiProperty({ 
      example: 'asda',
      description: 'The userAgent of the session',
      type: String
    })
    @IsNotEmpty()
    userAgent: string

    @ApiProperty({ 
      example: '123123111',
      description: 'The ip of the session',
      type: String
    })
    @IsNotEmpty()
    ip: string

}
