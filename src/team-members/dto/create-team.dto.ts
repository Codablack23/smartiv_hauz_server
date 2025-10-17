import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl } from 'class-validator';

export class CreateTeamMemberDto {
  @ApiProperty({
    example: 'Goodluck Edih',
    description: 'Name of the team member',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'goodluckedih@gmail.com',
    description: 'Email of the team member',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'CTO',
    description: 'Position or role of the team member',
  })
  @IsString()
  position: string;

  @ApiProperty({
    example: 'https://cdn.example.com/uploads/avatar.jpg',
    description: 'Avatar URL of the team member',
  })
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar: string;
}
