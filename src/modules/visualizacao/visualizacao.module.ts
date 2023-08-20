import { Module } from '@nestjs/common';
import { VisualizacaoService} from './service/visualizacao.service';
import { VisualizacaoController } from './controller/visualizacao.controller';
import { SaidaService } from '../saida/service/saida.service';
import { SaidaModule } from '../saida/saida.module';

@Module({
  imports: [SaidaModule],
  providers: [VisualizacaoService],
  controllers: [VisualizacaoController],
})
export class VisualizacaoModule {}
