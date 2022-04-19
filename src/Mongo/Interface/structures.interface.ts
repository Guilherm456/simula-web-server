export interface StructuresInterface {
  name: string;
  type_parameters: Object;
  states: StatesInterface;
}
interface StateInterface {
  name: string;
  color: string;
}

export interface StatesInterface extends Array<StateInterface> {}
