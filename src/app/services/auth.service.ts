import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { map } from "rxjs/operators";
import { Usuario } from '../models/usuario.model';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingre-egreso.actions';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authSubscribe!: Subscription;
  private _user!: Usuario;

  get user() {
    return this._user;
  }
  constructor(public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe((fuser: any) => {
      //  console.log(fuser?.uid);
      if (fuser) {
        this.authSubscribe = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe((fireStoreUser: any) => {

            const user = Usuario.fromFirebase(fireStoreUser);
            this._user = user;
            this.store.dispatch(authActions.setUser({ user }));
          })
      } else {

        this.authSubscribe.unsubscribe();
        this.store.dispatch(authActions.unSetUser())
        this.store.dispatch(ingresoEgresoActions.unSetItems())

      }
    })
  }


  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user!.uid, nombre, email);
        return this.firestore.doc(`${user?.uid}/usuario`)
          .set({ ...newUser });
      })
  }
  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    );
  }
}
