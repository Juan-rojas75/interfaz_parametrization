import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {

    @ApiProperty({
        example: 'Admin',
        description: 'The name of the role',
        type: String
    })
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({
        example: 'Admin description',
        description: 'The description of the role',
        type: String
    })
    @IsString()
    description: string;
    
    @ApiProperty({
        example: ['create', 'read', 'update', 'delete'],
        description: 'The permissons of the role',
        type: Array<string>
    })
    @IsArray()
    permissons: string[];
    
    @ApiProperty({
        example: true,
        description: 'The status of the role',
        type: Boolean
    })
    @IsBoolean()
    status: boolean;    
    
    @ApiProperty({
        example: true,
        description: 'The isAdmin role',
        type: Boolean
    })
    @IsBoolean()
    isAdmin: boolean;    

}
