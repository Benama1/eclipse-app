import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateOfferDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsString() partner: string;
  @IsString() discount: string;
}
export class UpdateOfferDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() partner?: string;
  @IsOptional() @IsString() discount?: string;
  @IsOptional() @IsIn(['active', 'expired']) status?: string;
}
