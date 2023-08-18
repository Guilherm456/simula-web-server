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
        private readonly logger: LoggerServer
    ) {}

    async saveParsedData(simulationId: string, parsedData: object): Promise<SaidaDTO> {
        const saidaDto = new SaidaDTO();

        saidaDto.simulationId = simulationId;
        saidaDto.data = parsedData;

        const savedSaida = await this.saidaRepository.saveSaida(saidaDto.simulationId, saidaDto.data);

        return {
            simulationId: savedSaida.simulationId.toString(),  // convert ObjectId to string
            data: savedSaida.data
        };
    }

    async parseDirectory(dir: string): Promise<any> {
      let data = {};

      const files = fs.readdirSync(dir);
      for (let file of files) {
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
        let data: number[][] = [];
        Papa.parse(fs.createReadStream(filePath, 'utf-8'), {
          skipEmptyLines: true,
          delimiter: ';',
          dynamicTyping: true,
          step: (results: Papa.ParseResult<any>) => {
            if (Array.isArray(results.data)) {
              const parsedRow = results.data.map(cell => parseFloat(cell));
              data.push(parsedRow);
            }
          },
          complete: () => {
            resolve(data);
          },
          error: (error) => {
            reject(error);
          }
        });
      });
    }
}
