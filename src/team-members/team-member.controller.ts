import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { TeamsMemberService } from './teams-member.service';
import { CreateTeamMemberDto } from './dto/create-team.dto';
import { UpdateTeamMemberDto } from './dto/update-team.dto';
import { JwtAuthGuard } from 'src/providers';
import { TeamMemberEntity } from 'src/entities/entity.teams';

@ApiTags('TeamMembers') // Groups these endpoints in Swagger
@Controller('team-members')
export class TeamsMemberController {
  constructor(private readonly teamsService: TeamsMemberService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Shows the "Authorize" button for JWT
  @Post()
  @ApiOperation({ summary: 'Create a new team member' })
  @ApiResponse({
    status: 201,
    description: 'Team member created successfully',
    type: TeamMemberEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Team member already exists or invalid data',
  })
  create(@Body() createTeamMemberDto: CreateTeamMemberDto) {
    return this.teamsService.create(createTeamMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all team members' })
  @ApiResponse({
    status: 200,
    description: 'List of all team members',
    type: [TeamMemberEntity],
  })
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific team member by ID' })
  @ApiResponse({
    status: 200,
    description: 'Team member found',
    type: TeamMemberEntity,
  })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing team member' })
  @ApiResponse({
    status: 200,
    description: 'Team member updated successfully',
    type: TeamMemberEntity,
  })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  update(
    @Param('id') id: string,
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
  ) {
    return this.teamsService.update(id, updateTeamMemberDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team member' })
  @ApiResponse({ status: 200, description: 'Team member deleted successfully' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }
}
