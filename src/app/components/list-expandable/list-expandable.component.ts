import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { FormReglaComponent } from '../form-regla/form-regla.component';

@Component({
  selector: 'app-list-expandable',
  templateUrl: './list-expandable.component.html',
  styleUrls: ['./list-expandable.component.scss'],
})
export class ListExpandableComponent implements OnDestroy {

  @Input() data: any;
  @Output() onShowClick = new EventEmitter();
  @Output() onEditMeta = new EventEmitter();
  private compDestroy: Subject<boolean> = new Subject();

  constructor(
    public modalController: ModalController
  ) { }

  ngOnDestroy(): void {
    this.compDestroy.next(true);
    this.compDestroy.complete();
  }

  // activa Emit al abrir o cerrar toggle de meta
  // y se almacena el cambio en STORE NGRX
  toogleShow(group: any) {
    this.onShowClick.emit(group);
  }

  // indicamos que se quiere editar una regla
  editRuler(meta: any, regla: any) {
    this.upFormGroup(meta, regla);
  }

  // levantamos modal formulario regla
  async upFormGroup(meta: any, regla?: any) {
    const modal = await this.modalController.create({
      component: FormReglaComponent,
      componentProps: {
        meta: meta, // pasamos mediante @Input() META a formulario FormRegla
        regla: regla // pasamos mediante @Input() REGLA a formulario FormRegla
      }
    });

    await modal.present();
  }

  goEditMeta(meta: any) {
    // this.upFormGroup(meta);
    this.onEditMeta.emit(meta);
  }

}
