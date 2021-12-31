import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SimulacaoDTO } from 'src/DTO/simulacao.dto';
import { Base } from '../Interface/base.interface';
import { Simulacao } from '../Interface/simulacao.interface';

@Injectable()
export class SimulacaoRepository {
  constructor(
    @InjectModel('simulacao') private readonly baseModel: Model<Simulacao>,
  ) {}

  async saveSimulacao(simulacao: SimulacaoDTO, base: Base): Promise<Simulacao> {
    const savedSimulacao = new this.baseModel({ ...simulacao, base: base });
    return await savedSimulacao.save();
  }
}
