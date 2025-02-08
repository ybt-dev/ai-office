import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterOrganizationDto {
  @IsString()
  @IsNotEmpty()
  userFirstName: string;

  @IsString()
  @IsNotEmpty()
  userLastName: string;

  @IsString()
  @IsNotEmpty()
  userEmail: string;
}
