import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Types } from "mongoose";
import { DataType } from "src/common/interfaces/type-data.interface";
import { Template } from "src/Template/db/model/template.model";

export class CreateDataTemplateDto {
        @ApiProperty({ 
            example: 'ID tamplate',
            description: 'The name of the Template',
            type: Types.ObjectId,
            required: true
        })
        @IsNotEmpty()
        template: Template | Types.ObjectId;
        
        @ApiProperty({ 
            example: 1,
            description: 'The position of the data column',
            type: Number,
            required: true,
        })
        @IsNotEmpty()
        @IsPositive()
        @IsNumber()
        index: number;
        
        @ApiProperty({ 
            example: 1,
            description: 'The length of the data column',
            type: Number,
            required: true,
        })
        @IsNotEmpty()
        @IsPositive()
        @IsNumber()
        length: number;
        
        @ApiProperty({ 
            example: 'Nombre',
            description: 'The name of the data column',
            type: String,
            required: true,
        })
        @IsNotEmpty()
        @IsString()
        name: string;
        
        @ApiProperty({ 
            example: 'link_name',
            description: 'The link name of the data column',
            type: String,
            required: true,
        })
        @IsNotEmpty()
        @IsString()
        link_name: string;
        
        @ApiProperty({ 
            example: 'Valor default',
            description: 'The default value of the data column',
            type: String,
            required: false,
        })
        @IsNotEmpty()
        @IsString()
        default: string;
    
        @ApiProperty({ 
        example: [{ value: 1, name: "value_1" }, { value: 2, name: "value_2" }],
        description: 'the value default of the data column',
        type: String,
        required: true,
        })
        @IsNotEmpty()
        @IsString()
        value_default: { value: number; name: string }[];;
        
        @ApiProperty({ 
            example: DataType.String,
            description: 'The Type of data column',
            type: String,
            required: true,
        })
        @IsNotEmpty()
        type: DataType;

        @ApiProperty({ 
            example: DataType.String,
            description: 'The format of data column date',
            type: String,
            required: false,
        })
        @IsOptional()
        format_date?: String;
        
        @ApiProperty({ 
        example: "1",
        description: 'the value for completed of the data column',
        type: String,
        required: true,
        })
        @IsNotEmpty()
        @IsString()
        complete_with: string;

        @ApiProperty({ 
        example: "left",
        description: 'the alignment of the data column',
        type: String,
        required: true,
        })
        @IsNotEmpty()
        @IsString()
        align: string;
        
        @ApiProperty({ 
            example: [{ default: "value1", replace: "value_replace_1" }, { default: "value2", replace: "value_replace_2" }],
            description: 'The values transform for the data column',
            type: String
        })
        @IsNotEmpty()
        @IsOptional()
        valuesTransform: { default: string; replace: string }[];

        @ApiProperty({ 
            example: Date.now(),
            description: 'The date of creation of Template',
            type: Boolean,
            required: false,
        })
        @IsDate()
        @IsOptional()
        createdAt?: Date;
    
        @ApiProperty({ 
            example: Date.now(),
            description: 'The date of update of Template',
            type: Boolean,
            required: false,
        })
        @IsDate()
        @IsOptional()
        updatedAt?: Date;
}
