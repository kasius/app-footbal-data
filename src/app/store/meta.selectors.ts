import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMetas from './meta.reducer';

export const selectMetas = createFeatureSelector<fromMetas.MetaState>(
  fromMetas.myMetasKey
);

// Token Api
export const getTokenApi = createSelector(selectMetas,
  (state: fromMetas.MetaState) => state.tokenApi
);
// Token Api

// Metas
export const getMetas = createSelector(selectMetas,
  (state: fromMetas.MetaState) => state.metas
);
// Metas

