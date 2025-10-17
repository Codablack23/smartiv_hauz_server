import { Test, TestingModule } from '@nestjs/testing';
import { TeamsMemberController } from './team-member.controller';
import { TeamsMemberService } from './teams-member.service';

describe('TeamsController', () => {
  let controller: TeamsMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsMemberController],
      providers: [TeamsMemberService],
    }).compile();

    controller = module.get<TeamsMemberController>(TeamsMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
