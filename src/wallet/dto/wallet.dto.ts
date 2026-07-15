import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, isBoolean, IsString, MinLength } from "class-validator";

const textAddress = "This address is for the Ethereum blockchain";
const textNetwork = "This network is for the Ethereum blockchain";
const textDefault = "This is the default wallet for the user";
export class createWalletDto {
    @ApiProperty({ example: textAddress })
    @IsString()
    address!: string;


    @ApiProperty({ example: textNetwork })
    @IsString()
    network!: string;

    @ApiProperty({ example: textDefault })
    @IsBoolean()
    isDefault!: boolean;
}

export class UpdateWalletDto {
    @ApiProperty({ example: textAddress })
    @IsString()
    address!: string;

    @ApiProperty({ example: textNetwork })
    @IsString()
    network!: string;
}


export class updateDefaultWalletDto {
    @ApiProperty({ example: textDefault })
    @IsBoolean()
    isDefault!: boolean;
}
