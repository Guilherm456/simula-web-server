import { ParametersService } from '@modules/parameters/services/parameters.service';
import { Simulacao } from '@modules/simulacao/interface/simulacao.interface';
import { Injectable } from '@nestjs/common';
import { createReadStream, readdirSync, statSync } from 'fs';
import * as Papa from 'papaparse';
import { join, resolve } from 'path';
import { LoggerServer } from 'src/loggerServer';
import { StructureService } from 'src/modules/structure/service/structure.service';
import { SaidaDTO } from '../../../DTO/saida.dto';
import { Output } from '../interface/output.interface';
import { SaidaRepository } from '../saida.repository';

@Injectable()
export class SaidaService {
  constructor(
    private readonly saidaRepository: SaidaRepository,
    private readonly logger: LoggerServer,
    private readonly structureService: StructureService,
    private readonly parametersService: ParametersService,
  ) {}

  async saveParsedData(simulation: Simulacao): Promise<SaidaDTO> {
    const simulationID = simulation._id.toString();

    this.logger.log(
      `Coletando dados resultantes da simulação ${simulationID}...`,
    );

    const structure = await this.structureService.getByID(
      simulation.structure.toString(),
    );

    if (!structure) throw new Error('Structure not found');

    const outputObject = {} as Output;

    this.logger.log(`Data has been parsed!`);

    outputObject.simulationId = simulationID;
    outputObject.structure = structure;

    const data = await this.parseDirectory(
      resolve(`output/${structure.folder}/${structure.resultsFolder || ''}`),
    );

    outputObject.data = data;

    const agentsStats = structure.agents.map((agent) => ({
      agent,
      stats: agent.onData(outputObject.data, agent),
    }));

    outputObject.agentsStats = agentsStats;

    try {
      outputObject.data = await this.parametersService.uploadAllParameters(
        outputObject.data,
      );

      const savedSaida = await this.saidaRepository.saveSaida(outputObject);

      this.logger.log(`Data parsed and saved successfully!`);

      return {
        simulationId: savedSaida.simulationId.toString(), // convert ObjectId to string
        data: savedSaida.data,
      };
    } catch (error) {
      this.logger.error(
        `Algum erro ocorreu ao salvar as saídas da simulação ${simulation._id}: ${error.message}`,
      );
      throw error;
    }
  }

  async parseDirectory(dir: string): Promise<any> {
    const data = {};

    const files = readdirSync(dir);
    for (const file of files) {
      const fullPath = join(dir, file);
      if (statSync(fullPath).isDirectory()) {
        data[file] = await this.parseDirectory(fullPath);
      } else {
        data[file] = await this.parseCSV(fullPath);
      }
    }

    return data;
  }

  async parseCSV(filePath: string): Promise<number[][]> {
    return new Promise((resolve, reject) => {
      const data: number[][] = [];
      Papa.parse(createReadStream(filePath, 'utf-8'), {
        skipEmptyLines: true,
        delimiter: ';',
        dynamicTyping: true,
        step: (results: Papa.ParseResult<any>) => {
          if (Array.isArray(results.data)) {
            const parsedRow = results.data.map((cell) => parseFloat(cell));
            data.push(parsedRow);
          }
        },
        complete: () => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  async getSaidaById(id: string): Promise<SaidaDTO | null> {
    try {
      const saida = await this.saidaRepository.getSaidaByID(id);
      if (saida) {
        return {
          simulationId: saida.simulationId.toString(),
          data: saida.data,
        };
      }
      return null;
    } catch (error) {
      this.logger.error(`Failed to get Saida by ID: ${error.message}`);
      throw error;
    }
  }

  async getSaidasBySimulationId(simulationId: string): Promise<SaidaDTO[]> {
    try {
      const saidas =
        await this.saidaRepository.getSaidasBySimulationID(simulationId);
      this.logger.log(`Saidas: ${saidas}`);
      return saidas.map((saida) => ({
        simulationId: saida.simulationId.toString(),
        data: saida.data,
      }));
    } catch (error) {
      this.logger.error(
        `Failed to get Saida by simulation ID: ${error.message}`,
      );
      throw error;
    }
  }

  async getAllSaidas(): Promise<SaidaDTO[]> {
    try {
      const saidas = await this.saidaRepository.getAllSaidas();
      saidas.forEach((saida) => {
        this.logger.log(`Saida: ${saida.simulationId}`);
      });
      return saidas.map((saida) => ({
        simulationId: saida.simulationId?.toString(),
        data: saida.data,
      }));
    } catch (error) {
      this.logger.error(`Failed to get all Saidas: ${error.message}`);
      throw error;
    }
  }

  async deleteSaidaBySimulationId(simulationId: string): Promise<boolean> {
    try {
      await this.saidaRepository.deleteSaida(simulationId);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to delete Saida by simulation ID: ${error.message}`,
      );
      return false;
    }
  }
}
