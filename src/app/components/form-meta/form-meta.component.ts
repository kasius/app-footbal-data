import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { MetasFacade } from 'src/app/store/meta.facade';
import * as moment from 'moment';

@Component({
  selector: 'app-form-meta',
  templateUrl: './form-meta.component.html',
  styleUrls: ['./form-meta.component.scss'],
})
export class FormMetaComponent implements OnInit, OnDestroy {

  // declarations
  @Input() meta: any;
  public datePlusMonth = null;
  public formMeta: FormGroup;
  private compDestroy: Subject<boolean> = new Subject();

  constructor(
    private fb: FormBuilder, // utilizamos FormBuilder
    private metaFacade: MetasFacade, // fachada NGRX para el manejo de store en la APP
    private modalController: ModalController
  ) { }

  ngOnInit() {
    console.log('this.meta...');
    console.log(this.meta);
    console.log('this.meta...');
    this.initForm();

    // añadimos 1 mes desde fecha actual
    this.datePlusMonth = moment().add(1, 'M').format('YYYY-MM-DD');
  }

  ngOnDestroy(): void {
    this.compDestroy.next(true);
    this.compDestroy.complete();
  }

  // inicia formuario reactivo con validaciones
  initForm() {
    this.formMeta = this.fb.group({
      id: this.meta ? this.meta.id : null,
      name: [this.meta ? this.meta.name : null, Validators.required],
      type: [this.meta ? this.meta.type : null, Validators.required],
      date: [this.meta ? this.meta.date : this.datePlusMonth, Validators.required],
      amount: [this.meta ? +this.meta.amount : null, Validators.compose([Validators.pattern(/^[0-9]+/), Validators.required])],
      show: (this.meta && this.meta.show) ? +this.meta.show : null
    });
  }

  modalDismiss() {
    this.modalController.dismiss();
  }

  // gestiona la agregación/edición de metas según corresponda
  addMeta(meta: any) {
    // si existe objeto META es edición de lo contrario creación
    if (this.meta) {
      this.metaFacade.editMeta(meta);
    } else {
      meta.id = (+(new Date())).toString();
      meta.show = false;
      meta.reglas = [];
      this.metaFacade.addMeta(meta);
    }
    this.modalDismiss();
  }

}
