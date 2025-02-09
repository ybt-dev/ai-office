import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  signature: string;
}

export class CreateSessionNonceDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}
