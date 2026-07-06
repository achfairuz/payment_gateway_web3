import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateMerchantDto {
    @ApiPropertyOptional({ example: 'My Store' })
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;
}

export class CreateMerchantDto {
    @ApiProperty({ name: 'Your Merchant Name', example: 'My Store' })
    name!: string;

    @ApiProperty({ example: 'This API key is for accessing the payment gateway' })
    @IsString()
    apiKey!: string;


    @ApiProperty({ example: '' })
    @IsString()
    secretKey!: string;
}

export class ApiKeyResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty({ description: 'Raw API key, only shown once on creation' })
    apiKey!: string;

    @ApiProperty()
    createdAt!: Date;
}
