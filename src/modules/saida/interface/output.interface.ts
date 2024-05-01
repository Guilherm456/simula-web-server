import { Simulacao } from '@modules/simulacao/interface';
import { Structure } from '@modules/structure/entities/structures.interface';

export interface Output {
  _id?: string;
  simulation: Simulacao | string;
  data: object;
  structure: string | Structure;
  createdAt: string;

  agentsStats: {
    agent: object;
    stats: number[];
  }[];
}
