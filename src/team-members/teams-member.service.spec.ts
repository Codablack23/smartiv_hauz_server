import { Test, TestingModule } from '@nestjs/testing';
import { TeamsMemberService } from './teams-member.service';

describe('TeamsService', () => {
  let service: TeamsMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamsMemberService],
    }).compile();

    service = module.get<TeamsMemberService>(TeamsMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
