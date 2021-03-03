import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  getEquipos() {
    return this.http.get<any>(`${environment.api}/competitions/2001/teams?season=2019&stage=GROUP_STAGE`);
  }

  getResultados() {
    return this.http.get<any>(`${environment.api}/competitions/2001/matches?stage=GROUP_STAGE,ROUND_OF_16,QUARTER_FINALS,SEMI_FINALS,FINAL&season=2019`);
  }
}
