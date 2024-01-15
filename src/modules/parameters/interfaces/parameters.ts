export interface PayloadParameters {
  id: string;
  /**
   * Operation
   * u: update
   * d: delete
   * a: add
   */
  op: 'u' | 'd' | 'a';

  details?: {
    index: number;
    value?: any;
    field?: string;
  }[];

  timestamp: number;
}

export interface Parameter {
  [key: string]: any;
}
