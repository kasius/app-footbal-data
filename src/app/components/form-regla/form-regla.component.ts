import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MetasFacade } from 'src/app/store/meta.facade';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form-regla',
  templateUrl: './form-regla.component.html',
  styleUrls: ['./form-regla.component.scss'],
})
export class FormReglaComponent implements OnInit, OnDestroy {

  // declarations
  @Input() meta: any;
  @Input() regla: any;
  public equipos = null;
  public formRegla: FormGroup;
  private compDestroy: Subject<boolean> = new Subject();

  constructor(
    private fb: FormBuilder, // utilizamos FormBuilder
    private apiService: ApiService, // servicio que nos comunica con API de football-data
    private metaFacade: MetasFacade, // fachada NGRX para el manejo de store en la APP
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    // activamos loading hasta que se carguen los equipos
    this.upLoading();

    // llamamos a servicio que carga los equipos
    // participantes de UCL 2019 de fase de grupos en adelante
    this.getEquipos();
  }

  ngOnDestroy(): void {
    this.compDestroy.next(true);
    this.compDestroy.complete();
  }

  // inicia formuario reactivo con validaciones
  initForm() {
    this.formRegla = this.fb.group({
      id: this.regla ? this.regla.id : null,
      metaId: [this.meta ? this.meta.id : null, Validators.required],
      equipoId: [this.regla ? this.regla.equipoId : null, Validators.required],
      type: [this.regla ? this.regla.type : null, Validators.required],
      amount: [this.regla ? +this.regla.amount : null, Validators.compose([Validators.pattern(/^[0-9]+/), Validators.required])],
      registers: []
    });
  }

  // bajamos modal y volvemos a listado de metas/reglas
  modalDismiss() {
    this.modalController.dismiss();
  }

  // traemos equipos UCL
  getEquipos() {
    this.apiService.getEquipos()
      .pipe(take(1), takeUntil(this.compDestroy))
      .subscribe(
        datosEquipos => {
          this.equipos = datosEquipos.teams;
          this.initForm();

          // bajamos loading de vista para dar acceso
          // a formulario
          this.loadingController.dismiss();
        });
  }

  // levanta alerta para mostrar mensaje según validaciones
  async presentAlert(message: string, description: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Información',
      subHeader: message,
      message: description,
      buttons: ['OK']
    });

    await alert.present();
  }

  // gestiona la agregación/edición de reglas según corresponda
  addRuler(regla: any) {
    // añadimos nombre de equipo al objeto a almacenar en store
    regla.equipoTxt = this.equipos.find(equipo => +equipo.id === +regla.equipoId).name;
    // validacion de no tener más de 5 reglas por meta
    if (this.meta.reglas.length >= 5) {
      this.presentAlert('5 alertas ya generadas!', 'No puedes generar más de 5 alertas por meta...');
    } else {
      // validamos que no exita tupla equipo/evento
      // en reglas ya existentes && objeto REGLA
      if ((this.meta && this.meta.reglas.length > 0) && !this.regla) {
        const reglas = this.meta.reglas;
        if (reglas.some(reg => +reg.equipoId === +regla.equipoId && reg.type === regla.type)) {
          this.presentAlert('Regla ya existente!', 'No puedes generar una regla con la tupla Equipo/Tipo ya existente...');
        } else {
          this.sendActionStore(regla);
        }
      } else {
        this.sendActionStore(regla);
      }
    }
  }

  // levantamos loading de ser necesario
  async upLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    await loading.present();
  }

  // enviamos cambios a STORE NGRX mediante
  // llamado de fachada
  sendActionStore(regla: any) {
    // si existe objeto REGLA es edición de lo contrario creación
    if (this.regla) {
      this.metaFacade.editReglaMeta(this.meta.id, regla);
    } else {
      this.metaFacade.addReglaMeta(this.meta.id, regla);
    }
    this.modalDismiss();
  }

}
