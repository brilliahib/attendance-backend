import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from '../../../common/decorators/match.decorator';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name should not be empty' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Username should not be empty' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Phone number should not be empty' })
  @MinLength(8, {
    message: 'Phone number must be at least 8 characters long',
  })
  phone: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Confirmation password should not be empty' })
  @Match('password', { message: 'Confirmation password must match password' })
  confirm_password: string;
}
