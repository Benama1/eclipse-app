import { IsIn, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString() user: string;
  @IsNumber() @IsPositive() amount: number;
  @IsIn(['Carte', 'Prélèvement', 'Virement', 'Wero']) method: string;
}

export class CreateContributionDto {
  @IsString() user: string;
  @IsNumber() @IsPositive() amount: number;
}

export class TransactionFilterDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() method?: string;
  @IsOptional() @IsString() q?: string;
}
