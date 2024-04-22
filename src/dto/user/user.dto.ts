import {
  IsNotEmpty,
  IsPhoneNumber,
  IsEmail,
  Matches,
  IsISO8601,
  MinLength,
  MaxLength,
} from 'class-validator';
import { validationForm } from '..//../constant/validate.regex';

export class UserUpdateDto {
  @IsNotEmpty({
    message: 'user.id-not-empty',
  })
  userId: number;

  @Matches(/^[^\d]+$/, {
    message: 'user.name-not-number',
  })
  @IsNotEmpty({
    message: 'user.name-not-empty',
  })
  name: string;

  @IsEmail(
    {},
    {
      message: 'user.email-not-valid',
    },
  )
  @IsNotEmpty({
    message: 'user.email-not-empty',
  })
  email: string;

  address: string;

  @IsPhoneNumber('VN', { message: 'user.phone-not-valid' })
  phone: string;

  @IsISO8601(
    {},
    {
      message: 'user.date-of-birth-not-valid',
    },
  )
  date_of_birth: string;

  avatar: string;
}

export class UserChangePassword {
  userId: number;
  @IsNotEmpty({ message: 'user.old-password-not-empty' })
  oldPassword: string;

  @Matches(validationForm.PASSWORD_REGEX, {
    message: 'user.password-not-valid',
  })
  @IsNotEmpty({ message: 'user.password-not-empty' })
  @MinLength(validationForm.PASSWORD_MIN_LENGTH)
  @MaxLength(validationForm.PASSWORD_MAX_LENGTH)
  newPassword: string;

  @Matches(validationForm.PASSWORD_REGEX, {
    message: 'user.password-not-valid',
  })
  @IsNotEmpty({ message: 'user.cfpassword-not-empty' })
  @MinLength(validationForm.PASSWORD_MIN_LENGTH)
  @MaxLength(validationForm.PASSWORD_MAX_LENGTH)
  confirmPassword: string;
}
