import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from "rxjs/operators";
import { Usuario } from '../models/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) { }

  initAuthListener() {
    this.auth.authState.subscribe((fuser: any) => {
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);

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
