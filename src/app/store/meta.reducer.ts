import { Action, createReducer, on } from '@ngrx/store';
import * as myMetasActions from './meta.actions';
import { Meta } from './meta.model';
import * as moment from 'moment';

export const myMetasKey = 'MetasUsuario';

export interface MetaState {
  tokenApi: string,
  metas: Meta[];
}

export const initialState: MetaState = {
  tokenApi: '8e37313e7b994edcb75f78b6cdb93efe',
  metas: [
    {
      id: '1',
      type: '1',
      name: 'Ahorro para Viajar',
      show: true,
      date: moment().add(1, 'M').format('YYYY-MM-DD'),
      amount: 1000,
      reglas: []
    },
    {
      id: '2',
      type: '2',
      show: true,
      name: 'Solo por ahorrar',
      date: moment().add(1, 'M').format('YYYY-MM-DD'),
      amount: 2000,
      reglas: []
    },
  ]
};


export const reducerMeta = createReducer(
  initialState,

  // Dashboard
  on(myMetasActions.getMetas, state => state),
  on(myMetasActions.addMeta, (state, payload) => ({
    ...state,
    metas: [...state.metas, {
      ...payload.meta,
    }]
  })),

  on(myMetasActions.addReglaMeta, (state, payload) => ({
    ...state,
    metas: state.metas.map(meta => +meta.id === +payload.metaId ? { ...meta, reglas: [...meta.reglas, { ...payload.regla, id: (+(new Date())).toString() }] } : meta)
  })),

  on(myMetasActions.editReglaMeta, (state, payload) => ({
    ...state,
    metas: state.metas.map(meta => +meta.id === +payload.metaId ? {
      ...meta, reglas: meta.reglas.map(regla => regla.id === payload.regla.id ? { ...regla, ...payload.regla } : regla)
    } : meta)
  })),
  on(myMetasActions.editMeta, (state, payload) => ({
    ...state,
    metas: state.metas.map(
      (meta) => meta.id === payload.meta.id ? {
        ...meta,
        id: payload.meta.id,
        name: payload.meta.name,
        type: payload.meta.type,
        date: payload.meta.date,
        amount: payload.meta.amount,
        show: payload.meta.show
      } : meta)
  }))

);

export function reducerMyBoardUser(state: MetaState | undefined, action: Action) {
  return reducerMeta(state, action);
}

