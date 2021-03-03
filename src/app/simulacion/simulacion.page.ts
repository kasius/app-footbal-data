import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MetasFacade } from '../store/meta.facade';
import { Meta } from '../store/meta.model';
import { ApiService } from '../services/api.service';
import { ToastService } from '../services/toast-service';

@Component({
  selector: 'app-simulacion',
  templateUrl: './simulacion.page.html',
  styleUrls: ['./simulacion.page.scss'],
})
export class SimulacionPage implements OnInit, OnDestroy {

  // declarations
  public amount = 0;
  public metas = null;
  public resultados = null;
  public listMetas$: Observable<Meta[]>;
  private compDestroy: Subject<boolean> = new Subject();

  constructor(
    private apiService: ApiService, // servicio que nos comunica con API de football-data
    private metaFacade: MetasFacade, // fachada NGRX para el manejo de store en la APP
    private toastCtrl: ToastService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    // activamos loading hasta que se carguen los equipos
    this.upLoading();

    // llamamos a servicio que carga data de
    // resultados desde 4tos en adelante para UCL 2019
    this.getResultados();

    // mediante programación reactiva traemos METAS en Store
    // para ser listadas en vista mediante PIPE ASYNC
    this.listMetas$ = this.metaFacade.getMetas$();

    // rescatamos metas en controller
    this.listMetas$.subscribe(metas => this.metas = metas);

  }

  ngOnDestroy(): void {
    this.compDestroy.next(true);
    this.compDestroy.complete();
  }

  // traemos resultados UCL 2019
  getResultados() {
    this.apiService.getResultados()
      .pipe(take(1), takeUntil(this.compDestroy))
      .subscribe(
        datosEquipos => {
          this.resultados = datosEquipos.matches;

          // bajamos loading de vista para dar acceso
          // a formulario
          this.loadingController.dismiss();
        });
  }

  // levantamos loading de ser necesario
  async upLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    await loading.present();
  }

  // mostramos detalle ion-item
  detailItem(detail: string) {
    this.toastCtrl.presentToast(detail);
  }

  // realizamos calculos para reglas ingresadas en Metas generadas
  // según tipo de evento seleccionado y según equipo elegido
  simulation() {

    // reiniciamos monto global
    this.amount = 0;

    // agrupamos todas las reglas en una lista única,
    // de esta manera estamos capacitados para recorrer objeto de
    // resultados 1 unica vez
    const reglas = (this.metas.map(meta => meta.reglas.length > 0 ? meta.reglas : null).filter(Boolean).reduce((a, b) => a.concat(b)));

    // reducimos array de resultados a solo los resultados
    // que nos interesan o mejor dicho que el usuario configuro
    // en sus metas/reglas ingresadas, para los equipos seleccionados
    const resultadosFiltrados = this.resultados.map((result) => reglas.some(regla => ((+regla.equipoId === +result.homeTeam.id) || (+regla.equipoId === +result.awayTeam.id))) ? result : null).filter(Boolean);

    // recorremos resultados filtrados, de manera de hacer las operaciones
    // solo con los valores que nos competen
    const reglasConRegistros = reglas.map(regla => {
      // regla.registers = [];
      const reglaCustom = { ...regla, regitros: [] };
      const resultadosDelEquipo = resultadosFiltrados.filter(resultado => ((+resultado.homeTeam.id === +regla.equipoId) || (+resultado.awayTeam.id === +regla.equipoId)));
      if (regla.type.toUpperCase() === 'JUGAR') {
        // calculo para jugar
        let amountRuler = 0;
        resultadosDelEquipo.forEach(result => {
          amountRuler += +regla.amount;
          reglaCustom.regitros.push({ id: (+(new Date())).toString(), text: `${regla.amount} USD ahorrado por jugar contra ${+regla.equipoId === +result.homeTeam.id ? result.awayTeam.name : result.homeTeam.name} el día ${result.utcDate}`, amount: +amountRuler });
        });
        reglaCustom.amountSaved = +amountRuler; // monto generado por la regla
        this.amount += +reglaCustom.amountSaved; // sumamos a monto global
      }
      if (regla.type.toUpperCase() === 'GANAR') {
        // calculo para ganar
        let amountRulerWinner = 0;
        resultadosDelEquipo.forEach(result => {
          const winner = +regla.equipoId === +result.homeTeam.id ?
            (+result.score.fullTime.homeTeam > +result.score.fullTime.awayTeam) ? true : false :
            (+result.score.fullTime.awayTeam > +result.score.fullTime.homeTeam) ? true : false;
          if (winner) {
            amountRulerWinner += +regla.amount;
            reglaCustom.regitros.push({ id: (+(new Date())).toString(), text: `${regla.amount} USD ahorrado por ganar contra ${+regla.equipoId === +result.homeTeam.id ? result.awayTeam.name : result.homeTeam.name} el día ${result.utcDate}`, amount: +regla.amount });
          }
        });
        reglaCustom.amountSaved = +amountRulerWinner; // monto generado por la regla
        this.amount += +reglaCustom.amountSaved; // sumamos a monto global
      }

      if (regla.type.toUpperCase() === 'POR CADA GOOOL!') {
        // calculo para goles
        let amountRulerGoal = 0;
        resultadosDelEquipo.forEach(result => {
          const goals = +regla.equipoId === +result.homeTeam.id ? +result.score.fullTime.homeTeam : +result.score.fullTime.awayTeam;
          if (+goals > 0) {
            const amoutGoal = (+regla.amount * +goals);
            amountRulerGoal += +amoutGoal;
            reglaCustom.regitros.push({ id: (+(new Date())).toString(), text: `${amoutGoal} USD por anotar ${goals} contra equipo ${+regla.equipoId === +result.homeTeam.id ? result.awayTeam.name : result.homeTeam.name} el día ${result.utcDate}`, amount: +amoutGoal });
          }
        });
        reglaCustom.amountSaved = +amountRulerGoal; // monto generado por la regla
        this.amount += +reglaCustom.amountSaved; // sumamos a monto global
      }

      return reglaCustom;

    });

    this.savedChanges(reglasConRegistros);
  }

  savedChanges(reglasConRegistros: any) {
    reglasConRegistros.forEach(regla => {
      this.metaFacade.editReglaMeta(+regla.metaId, regla);
    });
  }

}
