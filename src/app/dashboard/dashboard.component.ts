import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ingresoEgresoActions from '../ingreso-egreso/ingre-egreso.actions';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubs!: Subscription
  ingresosSubs!: Subscription
  uid!: string;
  nombreUsuario!: string;
  constructor(private store: Store<AppState>, private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('auth')
      .pipe(
        filter(auth => auth.user !== null)
      )
      .subscribe(({ user }: any) => {
        this.nombreUsuario = user.nombre;
        console.log(user?.uid)
        this.ingresosSubs = this.ingresoEgresoService.initIngresoEgresosListener(user?.uid)
          .subscribe(ingresosEgresosFB => {
            console.log(ingresosEgresosFB);

            this.store.dispatch(ingresoEgresoActions.setItems({ items: ingresosEgresosFB }))
          })
      })
  }
  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
    this.userSubs.unsubscribe();
  }

}
