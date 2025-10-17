import { PartialType } from '@nestjs/swagger';
import { CreateTeamMemberDto } from './create-team.dto';

export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) {}
