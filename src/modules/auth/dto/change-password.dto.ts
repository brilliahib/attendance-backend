import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @Length(6, 255)
  @ApiProperty({
    description: 'Current password of the user',
    example: 'currentPassword123',
  })
  oldPassword!: string;

  @IsString()
  @Length(8, 255)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password baru minimal mengandung 1 huruf dan 1 angka',
  })
  @ApiProperty({
    description: 'New password for the user',
    example: 'newPassword123',
  })
  newPassword!: string;

  @IsString()
  @Length(8, 255)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Confirm password minimal mengandung 1 huruf dan 1 angka',
  })
  @ApiProperty({
    description: 'Confirmation of the new password',
    example: 'newPassword123',
  })
  confirmNewPassword!: string;
}
