import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { validationForm } from 'src/constant/validate.regex';

export class UserRegisterDto {
  @IsNotEmpty()
  @MinLength(validationForm.NAME_MIN_LENGTH)
  @MaxLength(validationForm.NAME_MAX_LENGTH)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(validationForm.EMAIL_MIN_LENGTH)
  @MaxLength(validationForm.EMAIL_MAX_LENGTH)
  email: string;

  @IsNotEmpty()
  @MinLength(validationForm.PASSWORD_MIN_LENGTH)
  @MaxLength(validationForm.PASSWORD_MAX_LENGTH)
  password: string;
}

export class UserLoginDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(validationForm.EMAIL_MIN_LENGTH)
  @MaxLength(validationForm.EMAIL_MAX_LENGTH)
  email: string;

  @IsNotEmpty()
  @MinLength(validationForm.PASSWORD_MIN_LENGTH)
  @MaxLength(validationForm.PASSWORD_MAX_LENGTH)
  password: string;
}
