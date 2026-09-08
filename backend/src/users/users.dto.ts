import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString() firstname: string;
  @IsString() lastname: string;
  @IsEmail() email: string;
  @IsIn(['admin', 'collab', 'employee']) role: 'admin' | 'collab' | 'employee';
  @IsOptional() @IsIn(['payment', 'dashboard', 'both']) access?: 'payment' | 'dashboard' | 'both';
  @IsOptional() @IsString() lang?: string;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @MinLength(6) password?: string;
}

export class UpdateUserDto {
  @IsOptional() @IsString() firstname?: string;
  @IsOptional() @IsString() lastname?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() lang?: string;
  @IsOptional() @IsString() currency?: string;
}
