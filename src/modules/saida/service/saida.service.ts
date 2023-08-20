import { Injectable } from '@nestjs/common';
import { SaidaRepository } from '../../../Mongo/repository/saida.repository';
import { SaidaDTO } from '../../../DTO/saida.dto';
import { LoggerServer } from 'src/loggerServer';
import * as fs from 'fs';
import * as path from 'path';
import * as Papa from 'papaparse';

@Injectable()
export class SaidaService {
  constructor(
    private readonly saidaRepository: SaidaRepository,
    private readonly logger: LoggerServer,
  ) {}

  async saveParsedData(
    simulationId: string,
    parsedData: object,
  ): Promise<SaidaDTO> {
    const saidaDto = new SaidaDTO();

    saidaDto.simulationId = simulationId;
    saidaDto.data = parsedData;

    const savedSaida = await this.saidaRepository.saveSaida(
      saidaDto.simulationId,
      saidaDto.data,
    );

    return {
      simulationId: savedSaida.simulationId.toString(), // convert ObjectId to string
      data: savedSaida.data,
    };
  }

  async parseDirectory(dir: string): Promise<any> {
    const data = {};

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
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
      Papa.parse(fs.createReadStream(filePath, 'utf-8'), {
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
