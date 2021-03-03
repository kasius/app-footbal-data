import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '../services/toast-service';
import { ModalController } from '@ionic/angular';
import { FormMetaComponent } from '../components/form-meta/form-meta.component';
import { MetasFacade } from '../store/meta.facade';
import { Observable, Subject } from 'rxjs';
import { Meta } from '../store/meta.model';

@Component({
  selector: 'app-meta',
  templateUrl: './meta.page.html',
  styleUrls: ['./meta.page.scss'],
})
export class MetaPage implements OnInit, OnDestroy {

  // declarations
  public type: string;
  public listMetas$: Observable<Meta[]>;
  private compDestroy: Subject<boolean> = new Subject();

  constructor(
    private metaFacade: MetasFacade, // fachada NGRX para el manejo de store en la APP
    public modalController: ModalController
  ) { }

  ngOnInit() {
    // mediante programación reactiva traemos METAS en Store
    // para ser listadas en vista mediante PIPE ASYNC
    this.listMetas$ = this.metaFacade.getMetas$();
  }

  ngOnDestroy(): void {
    this.compDestroy.next(true);
    this.compDestroy.complete();
  }

  // levantamos modal con componente FormMeta para la gestion de META
  async upFormMeta(meta?: any) {
    const modal = await this.modalController.create({
      component: FormMetaComponent,
      componentProps: {
        meta: meta // pasamos mediante @Input() META a formulario FormMeta
      }
    });

    await modal.present();
  }

  // gatillamos acción EditMeta, en este caso solo
  // para editar el campo show(mostrar u ocultar detalle de Meta)
  onShowClick(meta) {
    this.metaFacade.editMeta({ ...meta, show: !meta.show });
  }

}
