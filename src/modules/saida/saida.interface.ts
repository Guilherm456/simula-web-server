import { Simulacao } from '@modules/simulacao/interface';
import { Structure } from '@modules/structure/entities/structures.interface';
import { Document } from 'mongoose';

export type AgentStats = {
  agent: string | object;
  stats: number[];
};
export interface Output {
  simulation: Simulacao | string;
  data: object;
  structure: Structure | string;
  createdAt: string;
  agentsStats: AgentStats[];
  _id?: string;
}

export type OutputDocument = Output & Document;
