import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  entro: boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

    })
  }
  login() {
    if (this.loginForm.invalid) { return; }


    Swal.fire({
      title: 'Espere por favor!',

      didOpen: () => {
        Swal.showLoading()

      },

    })

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
      .then(login => {

        console.log(login);
        Swal.close();
        this.router.navigateByUrl('/')
      }).catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Email o password incorrectos!'
        })
      })
  }
}
