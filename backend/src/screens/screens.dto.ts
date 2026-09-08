import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateScreenDto {
  @IsString() name: string;
  @IsString() location: string;
}
export class UpdateScreenDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsIn(['active', 'offline', 'maintenance']) status?: string;
  @IsOptional() @IsString() content?: string;
}
