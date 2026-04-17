import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum AccountType {
  SAVINGS = 'SAVINGS',
  CHECKING = 'CHECKING',
}

export class CreateAccountDto {
  @IsEnum(AccountType)
  accountType!: AccountType;

  @IsString()
  @IsOptional()
  accountNumber?: string;  // Kalau kosong, auto-generate
}
