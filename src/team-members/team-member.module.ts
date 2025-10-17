import { Module } from '@nestjs/common';
import { TeamsMemberService } from './teams-member.service';
import { TeamsMemberController } from './team-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMemberEntity } from 'src/entities/entity.teams';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMemberEntity])],
  controllers: [TeamsMemberController],
  providers: [TeamsMemberService],
})
export class TeamsMemberModule {}
