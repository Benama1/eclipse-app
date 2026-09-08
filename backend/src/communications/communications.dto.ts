import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateCommunicationDto {
  @IsString() title: string;
  @IsString() content: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsIn(['urgent', 'important', 'normal', 'info']) priority?: string;
}
export class UpdateCommunicationDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsIn(['urgent', 'important', 'normal', 'info']) priority?: string;
  @IsOptional() @IsIn(['published', 'archived']) status?: string;
}
