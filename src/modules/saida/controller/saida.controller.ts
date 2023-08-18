import { Controller, Post, Param } from '@nestjs/common';
import { SaidaService } from '../service/saida.service';
import { LoggerServer } from 'src/loggerServer';

@Controller('saida')
export class SaidaController {
    constructor(
      private readonly saidaService: SaidaService,
      private readonly logger: LoggerServer,
    ) {}

    @Post("parse/:simulationId")
    async parseAndSave(@Param('simulationId') simulationId: string) {
        const parsedData = await this.saidaService.parseDirectory(`./simulator/Saidas/MonteCarlo_0/`);
        this.logger.log(`Data has been parsed!`);

        // If you plan to use this line later, remember to also use "await" here
        const savedData = await this.saidaService.saveParsedData(simulationId, parsedData);

        this.logger.log(`Data parsed and saved successfully!`);

        return { message: 'Data parsed and saved successfully!', data: parsedData };
    }
}

