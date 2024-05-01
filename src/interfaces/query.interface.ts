export type FilterDTO = {
  nome?: string;
  id?: number;
  [key: string]: any;
} & ListDTO;

export interface ListDTO {
  offset?: number;
  limit?: number;
}
