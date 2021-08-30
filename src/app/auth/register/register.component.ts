import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroForm!: FormGroup;
  uiSubscribe!: Subscription;
  cargando: boolean = false;
  constructor(private fb: FormBuilder,
    private authService: AuthService, private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
    this.uiSubscribe = this.store.select('ui')
      .subscribe(ui => {
        console.log("cargando subs")
        this.cargando = ui.isLoading;
      })
  }
  ngOnDestroy(): void {
    this.uiSubscribe.unsubscribe();
  }
  crearUsuario() {
    if (this.registroForm.invalid) { return; }

    this.store.dispatch(ui.isLoading())

    const { nombre, email, password } = this.registroForm.value;
    this.authService.crearUsuario(nombre, email, password)
      .then(credenciales => {
        this.store.dispatch(ui.stopLoading())
        this.router.navigateByUrl('/')
      }).catch(err => {
        this.store.dispatch(ui.stopLoading())
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message
        })
      });
  }
}
