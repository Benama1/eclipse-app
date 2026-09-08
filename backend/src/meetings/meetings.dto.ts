import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateMeetingDto {
  @IsString() title: string;
  @IsString() date: string;
  @IsString() time: string;
  @IsString() location: string;
  @IsOptional() @IsInt() @Min(0) participants?: number;
  @IsOptional() @IsString() description?: string;
}

export class UpdateMeetingDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsString() time?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsInt() participants?: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsIn(['upcoming', 'ongoing', 'done', 'cancelled']) status?: string;
}
