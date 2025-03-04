import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSessionDto } from './create-session.dto';
import { IsDate, IsOptional } from 'class-validator';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {

    @ApiProperty({ 
        example: Date.now(),
        description: 'The date of revoke the session',
        type: Date,
        required: false,
    })
    @IsOptional()
    @IsDate()
    revokedAt?: Date | null;

}
