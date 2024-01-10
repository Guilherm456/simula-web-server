import { ConsoleLogger } from '@nestjs/common';
import { appendFileSync, existsSync, statSync, unlinkSync } from 'fs';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'log';

export class LoggerServer extends ConsoleLogger {
  log(message: string | string[], context: string = '') {
    this.saveInFile(message, 'log');
    super.log(message, context);
  }
  error(message: string | string[], context: string = '') {
    this.saveInFile(message, 'error');
    super.error(message, context);
  }
  warn(message: string | string[], context: string = '') {
    this.saveInFile(message, 'warn');
    super.warn(message, context);
  }
  debug(message: string | string[], context: string = '') {
    this.saveInFile(message, 'debug');
    super.debug(message, context);
  }

  //Função para salvar logs no arquivo
  saveInFile(message: string | string[], type: LogLevel) {
    const file = `${__dirname}/log.txt`;
    if (existsSync(file)) {
      const size = statSync(file).size;
      //Se o arquivo for maior que 50MB, apaga o arquivo e recomeça
      if (size >= 50000000) {
        unlinkSync(file);
      }
    }
    const date = new Date().toLocaleString();
    //Log no arquivo vai parecer como: data - [tipo] [mensagem]
    const log = `${date} - [${type}] ${message} \n`;
    //Adiciona ao arquivo
    appendFileSync(file, log);
  }
}
