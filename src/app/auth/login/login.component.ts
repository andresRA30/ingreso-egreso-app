import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  entro: boolean = false;
  cargando: boolean = false;
  uiSubscription!: Subscription;
  constructor(private fb: FormBuilder,
    private authService: AuthService, private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

    });
    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
    })
  }
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }
  login() {
    if (this.loginForm.invalid) { return; }

    this.store.dispatch(ui.isLoading())

    // Swal.fire({
    //   title: 'Espere por favor!',

    //   didOpen: () => {
    //     Swal.showLoading()

    //   },

    // })

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
      .then(login => {
        this.store.dispatch(ui.stopLoading())

        // Swal.close();
        this.router.navigateByUrl('/')
      }).catch(err => {
        this.store.dispatch(ui.stopLoading())
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message
        })
      })
  }
}
