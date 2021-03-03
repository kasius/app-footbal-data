import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as metaActions from './meta.actions';
import * as metaSelectors from './meta.selectors';
import { Meta, Regla } from './meta.model';

@Injectable({
  providedIn: 'root'
})
export class MetasFacade {
  constructor(
    private store: Store<any>) { }

  // Token Api
  public getTokenApi$(): Observable<string> {
    return this.store.select(metaSelectors.getTokenApi);
  }
  // Token Api

  // Metas
  public getMetas() {
    this.store.dispatch(metaActions.getMetas());
  }

  public addMeta(meta: Meta) {
    this.store.dispatch(metaActions.addMeta({ meta: meta }));
  }

  public addReglaMeta(metaId: number, regla: Regla) {
    this.store.dispatch(metaActions.addReglaMeta({ metaId, regla }));
  }

  public editReglaMeta(metaId: number, regla: Regla) {
    this.store.dispatch(metaActions.editReglaMeta({ metaId, regla }));
  }

  public editMeta(meta: any) {
    this.store.dispatch(metaActions.editMeta({ meta: meta }));
  }

  public getMetas$(): Observable<Meta[]> {
    return this.store.select(metaSelectors.getMetas);
  }
  // Metas

}
