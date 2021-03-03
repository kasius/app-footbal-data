export interface Meta {
  id: string;
  type: string;
  name: string;
  date: string;
  amount: number;
  reglas: Regla[];
  show: boolean;
}

export interface Regla {
  id: string;
  metaId: string;
  equipoId: number;
  equipoTxt: string;
  type: string;
  amount: number;
  amountSaved: number;
  registers: any;
}

export interface Registro {
  id: string;
  text: string;
  amount: number;
}