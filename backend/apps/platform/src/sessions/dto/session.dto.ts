import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class CreateSessionTokenDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
