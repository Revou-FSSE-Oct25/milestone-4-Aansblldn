import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  accountType?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}