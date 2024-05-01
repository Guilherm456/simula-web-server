import { ParametersService } from '@modules/parameters/services/parameters.service';
import { Simulacao } from '@modules/simulacao/interface/simulacao.interface';
import { SimulacaoService } from '@modules/simulacao/service/simulacao.service';
import { StructureParameters } from '@modules/structure/entities/structures.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { existsSync, readFileSync, rmSync } from 'fs';
import { parse } from 'papaparse';
import { join, resolve } from 'path';
import { LoggerServer } from 'src/loggerServer';
import { StructureService } from 'src/modules/structure/service/structure.service';
import { Output } from '../interface/output.interface';
import { AgentStats } from '../saida.interface';
import { SaidaRepository } from '../saida.repository';

@Injectable()
export class SaidaService {
  constructor(
    private readonly saidaRepository: SaidaRepository,
    private readonly logger: LoggerServer,
    private readonly structureService: StructureService,
    private readonly parametersService: ParametersService,
    private readonly simulationService: SimulacaoService,
  ) {}

  async saveParsedData(simulation: Simulacao) {
    const simulationID = simulation._id.toString();

    this.logger.log(
      `Coletando dados resultantes da simulação ${simulationID}...`,
    );

    const structure = await this.structureService.getByID(
      simulation.structure.toString(),
    );

    if (!structure) throw new Error('Estrutura não encontrada');

    const folder = resolve(`output/${structure.folder}`);

    const resultsFolder = resolve(`${folder}${structure.resultsFolder ?? ''}`);

    const outputObject = {} as Output;

    outputObject.simulation = simulationID;
    outputObject.structure = structure;

    const data = await this.parseDirectory(
      resultsFolder,
      structure.outputParameters,
    );

    outputObject.data = data;

    const agentsStats = structure.agents?.map((agent) => ({
      agent,
      stats: eval(agent.onData as unknown as string)(data, agent) ?? [],
    }));

    for (const agent of agentsStats) {
      if (agent.stats.some((stat) => typeof stat !== 'number')) {
        this.logger.error(
          `Algum erro ocorreu ao calcular as estatísticas do agente ${agent.agent.name}, valide a estrutura e os dados de saída da simulação ${simulationID}`,
        );

        this.simulationService.replaceColumn(simulationID, 'status', 'ERROR');

        throw new Error(
          `Algum erro ocorreu ao calcular as estatísticas do agente ${agent.agent.name}, valide a estrutura e os dados de saída da simulação ${simulationID}`,
        );
      }
    }

    outputObject.agentsStats = agentsStats;

    try {
      const outputExists =
        await this.saidaRepository.getSaidaBySimulationID(simulationID);

      if (!!outputExists) {
        await this.parametersService.deleteAllParameters(outputExists.data);
      }
    } catch (error) {
      this.logger.error(
        `Algum erro ocorreu ao deletar as saídas da simulação ${simulation._id}: ${error.message}`,
      );
      this.simulationService.replaceColumn(simulationID, 'status', 'ERROR');

      throw error;
    }

    try {
      this.logger.log(
        `Deletando a pasta de resultados da simulação ${simulationID}...`,
      );

      rmSync(resultsFolder, { force: true, recursive: true });
    } catch (error) {
      this.logger.error(
        `Algum erro ocorreu ao deletar a pasta de resultados da simulação ${simulation._id}: ${error.message}`,
      );
      this.simulationService.replaceColumn(simulationID, 'status', 'ERROR');

      throw error;
    }

    try {
      await this.saveOutput(simulationID, outputObject);
    } catch (error) {
      this.logger.error(
        `Algum erro ocorreu ao salvar as saídas da simulação ${simulation._id}: ${error.message}`,
      );

      this.simulationService.replaceColumn(simulationID, 'status', 'ERROR');
      throw error;
    }
  }

  async saveOutput(simulationID: string, output: Output) {
    const oldOutput =
      await this.saidaRepository.getSaidaBySimulationID(simulationID);

    // Caso exista uma saída antiga, deleta todos os parâmetros associados a ela
    if (!!oldOutput) {
      await this.parametersService.deleteAllParameters(oldOutput.data);
    }

    // Salva todos os parâmetros associados a saída
    output.data = await this.parametersService.uploadAllParameters(output.data);

    // Salva a saída
    const savedOutput = await (!!oldOutput
      ? this.saidaRepository.updateOutput(oldOutput._id.toString(), output)
      : this.saidaRepository.saveOutput(output));

    // Cria a relação entre a simulação e a saída
    await this.simulationService.replaceColumn(
      simulationID,
      'output',
      savedOutput,
    );
  }

  async parseDirectory(
    dir: string,
    structure: StructureParameters[],
  ): Promise<any> {
    const data = {};

    await Promise.all(
      structure.map(async (parameter) => {
        if (parameter.subParameters?.length > 0)
          data[parameter.name] = await this.parseDirectory(
            join(dir, parameter.name),
            parameter.subParameters,
          );
        else
          data[parameter.name] = await this.parseCSV(
            join(dir, `${parameter.name}.csv`),
          );
      }),
    );

    return data;
  }

  async parseCSV(filePath: string): Promise<number[][]> {
    if (!existsSync(filePath))
      throw new Error(`Arquivo ${filePath} não existe!`);

    const file = readFileSync(filePath, 'utf8');

    const parsedData = parse(file, {
      dynamicTyping: true,
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
    });

    return parsedData.data as number[][];
  }

  async getData(ouputID: string, agentID: string): Promise<any> {
    const output = await this.saidaRepository.getSaidaByID(ouputID);
    if (!output)
      throw new HttpException('Saída não encontrada', HttpStatus.NOT_FOUND);

    const agent = output.agentsStats.find(
      (agent) => agent.agent?.toString() === agentID,
    );

    if (!agent)
      throw new HttpException('Agente não encontrado', HttpStatus.NOT_FOUND);

    return agent.stats;
  }

  async getDataAllAgents(outputID: string): Promise<AgentStats[]> {
    const output = await this.saidaRepository.getSaidaByID(outputID);
    if (!output)
      throw new HttpException('Saída não encontrada', HttpStatus.NOT_FOUND);

    const structure = await this.structureService.getByID(
      output.structure.toString(),
    );

    if (!structure) throw new Error('Estrutura não encontrada');

    const agentsStats = structure.agents?.map((agent) => ({
      agent,
      stats:
        output.agentsStats.find(
          (agentStats) => agentStats.agent?.toString() === agent._id.toString(),
        )?.stats ?? [],
    }));

    return agentsStats;
  }

  async getByID(id: string): Promise<Output> {
    const output = this.saidaRepository.getSaidaByID(id);

    if (!output)
      throw new HttpException('Saída não encontrada', HttpStatus.NOT_FOUND);

    return output as unknown as Output;
  }
}
