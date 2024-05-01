import { Process, Processor } from '@nestjs/bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Job } from 'bull';
import { Cache } from 'cache-manager';
import { LoggerServer } from 'src/loggerServer';
import { PayloadParameters } from './interfaces/parameters';
import { ParametersService } from './services/parameters.service';

@Injectable()
@Processor('editParameters')
export class ParametersProcessor {
  constructor(
    private readonly parametersService: ParametersService,
    private readonly logger: LoggerServer,
    private schedulerRegistry: SchedulerRegistry,

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  createLine = (parameters: object) => {
    const keys = Object.keys(parameters);
    const line = {};
    keys.forEach((key) => {
      line[key] = typeof parameters[key] === 'number' ? 0 : '';
    });
    return line;
  };

  @Process()
  async handleparameters(job: Job<PayloadParameters>) {
    const { id, op, details } = job.data;

    // Carregue o parâmetro do cache ou do serviço, se não estiver no cache
    let parameters = (await this.cacheManager.get(
      `parameters:${id}`,
    )) as object[];

    if (!parameters) {
      parameters = await this.parametersService.readFile(id);
    }

    switch (op) {
      case 'a': // Adicionar
        parameters.unshift(this.createLine(parameters[0]));
        break;
      case 'd': // Deletar
        if (details && Array.isArray(details)) {
          details.sort((a, b) => b.index - a.index); // Ordenar em ordem decrescente para evitar problemas de índice ao deletar
          details.forEach((detail) => {
            parameters.splice(detail.index, 1);
          });
        }
        break;
      case 'u': // Atualizar
        if (details && Array.isArray(details)) {
          details.forEach((detail) => {
            parameters[detail.index][detail.field] = detail.value;
          });
        }
        break;
      default:
        this.logger.error(`Operação desconhecida: ${op}`);
    }

    // Atualizar o cache
    await this.cacheManager.set(
      `parameters:${id}`,
      parameters,
      6 * 1000 * 60, // 6 minutos (1 minutos a mais que o cron job para evitar perder dados)
    );

    // Verifique se o cron job está rodando
    if (!this.schedulerRegistry.getCronJob('saveParameters').running) {
      this.schedulerRegistry.getCronJob('saveParameters').start();
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'saveParameters',
  })
  async handleCron() {
    const allKeys = await this.cacheManager.store.keys();
    this.schedulerRegistry.getCronJob('saveParameters').stop();

    const keys = allKeys.filter((key) => key.includes('parameters:'));

    // Salvar parâmetros alterados
    await Promise.all(
      keys.map(async (key) => {
        const parameters = await this.cacheManager.get(key);
        if (parameters) {
          const id = key.replace('parameters:', '');
          await this.parametersService.updateParameters(id, parameters as any);
        }
        this.cacheManager.del(key);
      }),
    );
  }
}
