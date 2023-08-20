import { Controller, Delete, Get, Param, Post, HttpException, HttpStatus } from "@nestjs/common";
import { SaidaService } from "../service/saida.service";
import { LoggerServer } from "src/loggerServer";

@Controller("saida")
export class SaidaController {
  constructor(
    private readonly saidaService: SaidaService,
    private readonly logger: LoggerServer,
  ) {}

  @Post("parse/:simulationId")
  async parseAndSave(@Param("simulationId") simulationId: string) {
    const parsedData = await this.saidaService.parseDirectory(
      `./simulator/Saidas/MonteCarlo_0/`,
    );
    this.logger.log(`Data has been parsed!`);

    const savedData = await this.saidaService.saveParsedData(
      simulationId,
      parsedData,
    );
    this.logger.log(`Data parsed and saved successfully!`);

    return { message: "Data parsed and saved successfully!", data: savedData };
  }

  @Get(":simulationId")
  async getSaidasBySimulationId(@Param("simulationId") simulationId: string) {
    const saidaData = await this.saidaService.getSaidasBySimulationId(
      simulationId,
    );

    if (!saidaData || saidaData.length === 0) {
      throw new HttpException('Saida not found', HttpStatus.NOT_FOUND);
    }

    this.logger.log(`Fetched Saida for Simulation ID: ${simulationId}`);
    return { message: "Saida data fetched successfully!", data: saidaData };
  }

  @Get()
  async getAllSaidas() {
    const allSaidas = await this.saidaService.getAllSaidas();
    this.logger.log(`Fetched all Saidas`);

    return { message: "All Saida data fetched successfully!", data: allSaidas };
  }

  @Delete(":simulationId")
  async deleteSaidaBySimulationId(@Param("simulationId") simulationId: string) {
    const deleted = await this.saidaService.deleteSaidaBySimulationId(
      simulationId,
    );

    if (!deleted) {
      throw new HttpException('Failed to delete Saida data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    this.logger.log(`Deleted Saida for Simulation ID: ${simulationId}`);
    return { message: "Saida data deleted successfully!" };
  }
}
