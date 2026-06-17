import { Test, TestingModule } from '@nestjs/testing';
import { TrendingController } from './trending.controller';
import { TrendingService } from './trending.service';

describe('TrendingController', () => {
  let controller: TrendingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrendingController],
      providers: [TrendingService],
    }).compile();

    controller = module.get<TrendingController>(TrendingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
