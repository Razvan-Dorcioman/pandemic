import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUser } from '../models/login-user';
import { AuthenticationService } from 'src/services/authentication.service';
import {GlobalConstants} from '../commons/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin: boolean;

  baseUrl: string;
  router: Router;
  loading: boolean

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') _baseUrl: string,
    _router: Router,
    private authService: AuthenticationService
  ) {
    this.baseUrl = GlobalConstants.baseUrl;
    this.router = _router
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    this.invalidLogin = false;
  }

  public validateControl(controlName: string) {
    return this.loginForm.controls[controlName].invalid && this.loginForm.controls[controlName].touched
  }

  public hasError(controlName: string, errorName: string) {
    return this.loginForm.controls[controlName].hasError(errorName)
  }

  loginUser(formValues: any) {

    const user: LoginUser = {
      email: formValues.email,
      password: formValues.password,
    }
    this.loading = true;
    this.authService.loginUser(user).subscribe(
      (result: any) => {
        localStorage.setItem("jwt", result.accessToken);
        this.invalidLogin = false;
        window.location.href = "/";
      }, err => {
        this.invalidLogin = true;
        this.loading = false;
      }
    )
  }

}