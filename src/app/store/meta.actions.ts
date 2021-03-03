import { createAction, props } from '@ngrx/store';
import { Meta, Regla } from './meta.model';


export const getMetas = createAction('[Metas] GET All');

export const addMeta = createAction('[Metas] ADD Meta', props<{ meta: Meta }>());

export const editMeta = createAction('[Metas] EDIT Meta', props<{ meta: Meta }>());

export const addReglaMeta = createAction('[Reglas Metas] ADD Regla para Meta', props<{ metaId: number, regla: Regla }>());

export const editReglaMeta = createAction('[Reglas Metas] Edit Regla para Meta', props<{ metaId: number, regla: Regla }>());

