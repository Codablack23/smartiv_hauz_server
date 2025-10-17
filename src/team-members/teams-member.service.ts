import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTeamMemberDto } from './dto/create-team.dto';
import { UpdateTeamMemberDto } from './dto/update-team.dto';
import { TeamMemberEntity } from 'src/entities/entity.teams';
import { Repository } from 'typeorm';
import { AppResponse } from 'src/lib';

@Injectable()
export class TeamsMemberService {
  constructor(
    @InjectRepository(TeamMemberEntity)
    private readonly teamMemberRepository: Repository<TeamMemberEntity>,
  ) {}

  async create(createTeamMemberDto: CreateTeamMemberDto) {
    const existingTeamMember = await this.teamMemberRepository.findOne({
      where: [
        { name: createTeamMemberDto.name },
        { email: createTeamMemberDto.email },
      ],
    });

    if (existingTeamMember) {
      throw new BadRequestException(
        AppResponse.getFailedResponse(
          'This team member has already been added',
        ),
      );
    }

    const newTeamMember = this.teamMemberRepository.create(createTeamMemberDto);
    const teamMember = await this.teamMemberRepository.save(newTeamMember);

    return AppResponse.getSuccessResponse({
      message: 'Team member added successfully',
      data: { team_member: teamMember },
    });
  }

  async findAll() {
    const teamMembers = await this.teamMemberRepository.find();
    return AppResponse.getSuccessResponse({
      message: 'Team members fetched successfully',
      data: { team_members: teamMembers },
    });
  }

  async findOne(id: string) {
    const teamMember = await this.teamMemberRepository.findOne({
      where: { id },
    });
    if (!teamMember) {
      throw new BadRequestException(
        AppResponse.getFailedResponse('Team member not found'),
      );
    }

    return AppResponse.getSuccessResponse({
      message: 'Team member fetched successfully',
      data: { team_member: teamMember },
    });
  }

  async update(id: string, updateTeamDto: UpdateTeamMemberDto) {
    const teamMember = await this.teamMemberRepository.preload({
      id,
      ...updateTeamDto,
    });

    if (!teamMember) {
      throw new BadRequestException(
        AppResponse.getFailedResponse('Team member not found'),
      );
    }

    const updated = await this.teamMemberRepository.save(teamMember);
    return AppResponse.getSuccessResponse({
      message: 'Team member updated successfully',
      data: { team_member: updated },
    });
  }

  async remove(id: string) {
    const teamMember = await this.teamMemberRepository.findOne({
      where: { id },
    });
    if (!teamMember) {
      throw new BadRequestException(
        AppResponse.getFailedResponse('Team member not found'),
      );
    }

    await this.teamMemberRepository.remove(teamMember);
    return AppResponse.getSuccessResponse({
      message: 'Team member deleted successfully',
    });
  }
}
