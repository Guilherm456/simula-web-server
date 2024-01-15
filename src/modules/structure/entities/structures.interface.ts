import { Document, Model } from 'mongoose';

export interface Structure {
  /**
   * Nome da simulação
   * @type {string}
   * @example 'SIR'
   */
  name: string;

  /**
   * Parâmetros que a simulação necessita
   */
  parameters: StructureParameters[];

  /**
   * Nome da pasta onde está os arquivos de entrada da simulação
   * @type {string}
   * @example '/entrada'
   */
  inputsFolder?: string;

  /**
   * Nome da pasta onde está os arquivos gerais da simulação
   * (ex: arquivos de entrada, arquivos de saída, etc)
   * É APENAS O NOME DA PASTA, NÃO O CAMINHO COMPLETO
   * @type {string}
   * @example '/epidemic-simulator'
   */
  folder: string;

  /**
   * Nome da pasta onde está os arquivos de saída da simulação
   * @type {string}
   * @example '/results'
   */
  resultsFolder?: string;

  /**
   * Quantidade de parâmetros que a simulação necessita
   * @type {number}
   * @example 3
   */
  lengthParams: number;

  /**
   * Comando para executar a simulação
   * @type {string}
   * @example 'python3 main.py'
   */
  executeCommand: string;

  agents: AgentStructure[];
}

export interface StructureValues {
  name: string;
  type: 'string' | 'number' | 'mixed';
}

export interface StructureParameters {
  name: string;
  values: StructureValues[];
  subParameters?: Exclude<StructureParameters[], 'subParameters'>;
}

type AgentStructure = {
  _id?: string;

  /**
   * Nome do agente
   * @type {string}
   * @example 'Mosquito'
   */
  name: string;

  /**
   * Label do agente
   * @type {string}
   * @example 'mosquito'
   */
  label: string;

  /**
   * Cor do agente
   * @type {string}
   * @example '#F4ff00'
   */
  color: string;

  /**
   * Função que retorna os dados estatísticos de um tipo de agente
   * @param data - O JSON de saída de todos os arquivos de saída da simulação
   * @returns Um array com os dados estatísticos do tipo de agente (número de agentes por ciclo)
   */
  onData: (data: object, type: AgentStructure) => number[];
};

export type StructureDocument = Structure & Document;

export type StructureModel = Model<StructureDocument>;
