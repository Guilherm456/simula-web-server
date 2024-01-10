import { Process, Processor } from '@nestjs/bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Job } from 'bull';
import { Cache } from 'cache-manager';
import { LoggerServer } from 'src/loggerServer';
import { ParametersService } from './services/parameters.service';
interface PayloadParameters {
  id: string;
  /**
   * Operation
   * u: update
   * d: delete
   * a: add
   */
  op: 'u' | 'd' | 'a';

  details?: number[];

  parameters?: object;

  timestamp: number;
}

@Injectable()
@Processor('editParameters')
export class ParametersProcessor {
  private test: string[];

  constructor(
    private readonly parametersService: ParametersService,
    private readonly logger: LoggerServer,
    private schedulerRegistry: SchedulerRegistry,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  @Process()
  async handleEditParameters(job: Job<PayloadParameters>) {
    const { id, op, details, parameters } = job.data;

    if (details) {
      details.sort((a, b) => b - a);
    }

    const parameter =
      ((await this.cacheManager.get(`editParameters:${id}`)) as object[]) ||
      ((await this.parametersService.getParametersByID(id)) as object[]);

    if (!parameter) throw new Error('Parameters not found');

    switch (op) {
      case 'a':
        parameter?.push(parameters);
        break;
      case 'd':
        parameter?.filter((_, index) => !details?.includes(index));
        break;
      case 'u':
        parameter?.splice(details[0], 1, parameters);
        break;
    }

    await this.cacheManager.set(
      `editParameters:${id}`,
      parameter,
      10 * 60 * 1000,
    );

    if (!this.schedulerRegistry.getCronJob('saveParameters').running)
      this.schedulerRegistry.getCronJob('saveParameters').start();
    // await this.parametersService.updateParameters(id, parameter);
  }

  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'saveParameters',
  })
  async handleCron() {
    const allKeys = await this.cacheManager.store.keys();

    const keys = allKeys.filter((key) => key.includes('editParameters:'));

    await Promise.all(
      keys.map(async (key) => {
        const id = key.split(':')[1];
        const parameters = await this.cacheManager.get(key);
        await this.parametersService.updateParameters(id, parameters as object);
        await this.cacheManager.del(key);
      }),
    );
  }
}
