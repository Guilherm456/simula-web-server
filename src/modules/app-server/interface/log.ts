export interface Log {
  date: Date;
  message: string;
  type: 'log' | 'error' | 'warn' | 'info';
}
