import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { IdentificationType } from "../db/model/customer.model";

export class CreateCustomerDto {
     
      @ApiProperty({ 
        example: 'Nombre',
        description: 'The name of the Customer',
        type: String
      })
      @IsNotEmpty()
      name: string;
    
      @ApiProperty({ 
        example: IdentificationType.NIT,
        description: 'The type of customer',
        type: String
      })
      @IsNotEmpty()
      identitycation_type: IdentificationType;

      @ApiProperty({ 
        example: '1212',
        description: 'The Identification of the Customer',
        type: String
      })
      @IsNotEmpty()
      identificacion: string;

      @ApiProperty({ 
        example: false,
        description: 'The status of Customer',
        type: Boolean
      })
      @IsNotEmpty()
      @IsBoolean()
      status: boolean;

      @ApiProperty({ 
          example: Date.now(),
          description: 'The date of creation of Customer',
          type: Boolean,
          required: false,
      })
      @IsOptional()
      @IsDate()
      createdAt?: Date;
      
      @ApiProperty({ 
        example: Date.now(),
        description: 'The date of update of Customer',
        type: Boolean,
        required: false,
      })
      @IsOptional()
      @IsDate()
      updatedAt?: Date;

}
