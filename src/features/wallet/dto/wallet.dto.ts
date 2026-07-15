import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { IsSupportedNetwork } from '../validators/is-supported-network.validator';

const textAddress = 'Wallet address that will receive payments';
const textNetwork = 'Blockchain network (ethereum or polygon)';
const textDefault = 'Mark this wallet as the default one for the merchant';

export class CreateWalletDto {
  @ApiProperty({ example: '0x1234567890abcdef1234567890abcdef12345678', description: textAddress })
  @IsString()
  @MinLength(10)
  address!: string;

  @ApiProperty({ example: 'ethereum', description: textNetwork })
  @IsString()
  @IsSupportedNetwork()
  network!: string;

  @ApiProperty({ example: false, description: textDefault, required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateWalletDto {
  @ApiProperty({ example: '0x1234567890abcdef1234567890abcdef12345678', description: textAddress })
  @IsString()
  @MinLength(10)
  address!: string;

  @ApiProperty({ example: 'ethereum', description: textNetwork })
  @IsString()
  @IsSupportedNetwork()
  network!: string;
}

export class UpdateDefaultWalletDto {
  @ApiProperty({ example: true, description: textDefault })
  @IsBoolean()
  isDefault!: boolean;
}
