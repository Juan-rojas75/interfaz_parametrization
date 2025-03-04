import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNotEmpty } from "class-validator";
import { DataType } from "src/common/interfaces/type-data.interface";
export class CreateColumnsDto {
     
      @ApiProperty({ 
        example: 'Nombre',
        description: 'The name of the User',
        type: String
      })
      @IsNotEmpty()
      name: string;
    
      @ApiProperty({ 
        example: 'container',
        description: 'The email of the User',
        type: String
      })
      @IsNotEmpty()
      container: string;
    
      @ApiProperty({ 
        example: DataType.String,
        description: 'The type of column',
        type: String
      })
      @IsNotEmpty()
      type: DataType;

      @ApiProperty({ 
        example: [{ value: 1, name: "value1" }, { value: 2, name: "value2" }],
        description: 'The valuesDefault of column',
        type: String
      })
      @IsNotEmpty()
      valuesDefault: { value: number; name: string }[];

      @ApiProperty({ 
        example: false,
        description: 'The status of column',
        type: Boolean
      })
      @IsNotEmpty()
      @IsBoolean()
      status: boolean;

      @ApiProperty({ 
          example: Date.now(),
          description: 'The date of creation of column',
          type: Boolean,
          required: true,
      })
      @IsDateString()
      createdAt: Date;
  
      @ApiProperty({ 
          example: Date.now(),
          description: 'The date of update of column',
          type: Boolean,
          required: true,
      })
      @IsDateString()
      updatedAt: Date;

}
