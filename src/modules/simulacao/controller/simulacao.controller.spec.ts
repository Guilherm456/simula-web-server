import { Test, TestingModule } from '@nestjs/testing';
import { SimulacaoController } from './simulacao.controller';

describe('SimulacaoController', () => {
  let controller: SimulacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulacaoController],
    }).compile();

    controller = module.get<SimulacaoController>(SimulacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
