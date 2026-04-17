import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class DepositDto {
  @IsString()
  accountId!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsOptional()
  description?: string;
}
