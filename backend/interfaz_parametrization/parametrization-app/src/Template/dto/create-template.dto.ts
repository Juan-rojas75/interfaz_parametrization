import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";
import { Customer } from "src/Customer/db/model/customer.model";

export class CreateTemplateDto {

    @ApiProperty({ 
        example: 'ID cliente',
        description: 'The name of the Template',
        type: Types.ObjectId,
        required: true
    })
    @IsNotEmpty()
    customer: Customer | Types.ObjectId;
    
    @ApiProperty({ 
        example: 'Nombre',
        description: 'The name of the Template',
        type: String,
        required: true,
    })
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({ 
        example: 'Extension',
        description: 'The extension of the Template',
        type: String,
        required: true,
    })
    @IsNotEmpty()
    extension: string;

    @ApiProperty({ 
    example: false,
    description: 'If the template is default',
    type: Boolean,
    required: true,
    })
    @IsNotEmpty()
    @IsBoolean()
    default: boolean;

    @ApiProperty({ 
    example: true,
    description: 'The status of Template',
    type: Boolean,
    required: true,
    })
    @IsNotEmpty()
    @IsBoolean()
    status: boolean;

    //Fields
    @ApiProperty({ 
        example: [{name: 'Nombre', type: 'String', required: true, default: 'Nombre'}],
        description: 'The fields of Template',
        type: [Object],
        required: false,
    })
    @IsOptional()
    fields?: any[];

    @ApiProperty({ 
        example: Date.now(),
        description: 'The date of creation of Template',
        type: Boolean,
        required: false,
    })
    @IsOptional()
    @IsDate()
    createdAt?: Date;
    
    @ApiProperty({ 
        example: Date.now(),
        description: 'The date of update of Template',
        type: Boolean,
        required: false,
    })
    @IsOptional()
    @IsDate()
    updatedAt?: Date;

}
