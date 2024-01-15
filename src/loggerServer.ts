import { ConsoleLogger } from '@nestjs/common';
import {
  WriteStream,
  createWriteStream,
  existsSync,
  statSync,
  unlinkSync,
} from 'fs';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'log';

export class LoggerServer extends ConsoleLogger {
  private logStream: WriteStream;
  private readonly maxLogSize = 5000000; // 5MB
  private readonly logFile = `${__dirname}/log.json`;

  constructor() {
    super();
    this.rotateLogFileIfNeeded();
    this.initializeLogStream();
  }
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

  private rotateLogFileIfNeeded() {
    if (existsSync(this.logFile)) {
      const size = statSync(this.logFile).size;
      if (size >= this.maxLogSize) {
        unlinkSync(this.logFile);
        this.log('Arquivo de log rotacionado');
      }
    }
  }

  private initializeLogStream() {
    this.logStream = createWriteStream(this.logFile, { flags: 'a' });
  }

  private checkAndRotateLogFile() {
    const size = statSync(this.logFile).size;
    if (size >= this.maxLogSize) {
      this.logStream.end(); // Fecha o stream atual
      this.rotateLogFileIfNeeded(); // Rotaciona o arquivo
      this.initializeLogStream(); // Cria um novo stream
    }
  }
  //Função para salvar logs no arquivo
  saveInFile(message: string | string[], type: LogLevel) {
    this.checkAndRotateLogFile();
    const date = new Date().toISOString();
    const logEntry = JSON.stringify({ date, type, message }) + '\n';
    this.logStream.write(logEntry);
  }
}
