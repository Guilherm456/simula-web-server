import { Structure } from '@modules/structure/entities/structures.interface';

export interface Output {
  _id?: string;

  simulationId: string;
  data: object;
  structure: string | Structure;
  createdAt: string;

  agentsStats: {
    agent: object;
    stats: number[];
  }[];
}
