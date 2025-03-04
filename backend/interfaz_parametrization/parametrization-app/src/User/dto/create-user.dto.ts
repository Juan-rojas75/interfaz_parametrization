import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';
import { Customer } from 'src/Customer/db/model/customer.model';
import { Rol } from 'src/roles/db/model/roles.model';

export class CreateUserDto {
  
  @ApiProperty({ 
    example: 'Nombre',
    description: 'The name of the User',
    type: String
  })
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  username: string;

  @ApiProperty({ 
    example: 'Email@email.com',
    description: 'The email of the User',
    type: String
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ 
    example: '12345',
    description: 'The password of the User',
    type: String
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ 
    example: 'avatar.png',
    description: 'The avatar image of the User',
    type: String
  })
  @IsString()
  @IsOptional()
  avatar: string;
  
  @ApiProperty({ 
    example: '124512467621234sdsng5ujlklñredd',
    description: 'The acces token  of the User',
    type: String
  })
  @IsString()
  @IsOptional()
  access_token?: string;

  @ApiProperty({ 
    example: true,
    description: 'The status  of the User',
    type: Boolean
  })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @ApiProperty({ 
      example: 'ID Roles',
      description: 'The name of the rol',
      type: Types.ObjectId,
      required: true
  })
  @IsNotEmpty()
  rol: Rol | Types.ObjectId;

  @ApiProperty({ 
      example: 'ID cliente',
      description: 'The id of the customer',
      type: Types.ObjectId,
      required: true
  })
  @IsNotEmpty()
  customer: Customer | Types.ObjectId;

}
