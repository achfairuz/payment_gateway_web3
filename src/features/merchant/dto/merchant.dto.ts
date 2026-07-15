import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { IsNotBlank } from '../validators/is-not-blank.validator';

export class UpdateMerchantDto {
    @ApiPropertyOptional({ example: 'My Store' })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @IsNotBlank()
    name?: string;
}

export class CreateMerchantDto {
    @ApiProperty({ name: 'Your Merchant Name', example: 'My Store' })
    @IsString()
    @MinLength(2)
    @IsNotBlank()
    name!: string;
}
