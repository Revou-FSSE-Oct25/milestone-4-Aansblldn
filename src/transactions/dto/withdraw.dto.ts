import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class WithdrawDto {
  @IsString()
  accountId!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsOptional()
  description?: string;
}