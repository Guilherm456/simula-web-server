export interface StructuresInterface {
  //Nome da doença
  name: string;
  //Os parametros iniciais necessários
  type_parameters: Object;
  //Os possíveis estados da doença
  states: StatesInterface;
  //Responsável por definir em quais objetos deve buscar os dados
  defaultSearch: [string, string];
}
interface StateInterface {
  name: string;
  color: string;
}

export interface StatesInterface extends Array<StateInterface> {}
