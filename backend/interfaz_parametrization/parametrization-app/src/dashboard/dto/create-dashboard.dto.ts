import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Types } from "mongoose";
import { DataType } from "src/common/interfaces/type-data.interface";
import { Customer } from "src/Customer/db/model/customer.model";

export class CreateDashboardDto {
        @ApiProperty({ 
            example: 'ID user',
            description: 'The id of the user',
            type: Types.ObjectId,
            required: true
        })
        @IsNotEmpty()
        userId: Types.ObjectId;

        @ApiProperty({ 
            example: 'ID customer',
            description: 'The id of the Customer',
            type: Types.ObjectId,
            required: true
        })
        @IsNotEmpty()
        customer: Customer | Types.ObjectId;

        @ApiProperty({ 
            example: 'Tipo',
            description: 'The type of the register',
            type: String,
            required: true,
        })
        @IsNotEmpty()
        @IsString()
        type: string;

        @ApiProperty({ 
            example: 'Status',
            description: 'The status of the register',
            type: String,
            required: true,
        })
        @IsNotEmpty()
        @IsString()
        status: string;
                
        @ApiProperty({ 
            example: 1,
            description: 'The records processed',
            type: Number,
            required: true,
        })
        @IsNotEmpty()
        @IsPositive()
        @IsNumber()
        recordsProcessed: number;
                
        @ApiProperty({ 
            example: 1,
            description: 'The total templates generated',
            type: Number,
            required: true,
        })
        @IsNotEmpty()
        @IsPositive()
        @IsNumber()
        totalTemplatesGenerated: number;
                
        @ApiProperty({ 
            example: 1,
            description: 'The total successful processes',
            type: Number,
            required: true,
        })
        @IsNotEmpty()
        @IsPositive()
        @IsNumber()
        totalSuccessfulProcesses: number;

        @ApiProperty({ 
            example: 1,
            description: 'The total failed processes',
            type: Number,
            required: true,
        })
        @IsNotEmpty()
        @IsPositive()
        @IsNumber()
        totalFailedProcesses: number;
        
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
