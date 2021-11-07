import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/services/authentication.service';
import { RegisterUser } from '../models/register-user';
import {GlobalConstants} from '../commons/global-constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  areErrors: boolean;
  errorList: Array<string> = []

  baseUrl: string;
  registerForm: FormGroup;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') _baseUrl: string,
    private authService: AuthenticationService
  ) {
    this.baseUrl = GlobalConstants.baseUrl;
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });
    this.areErrors = false;
  }

  passwordMatchValidator(formValues: any) {
    return formValues.password === formValues.confirmPassword && !this.validateControl('confirmPassword');
  }

  public validateControl(controlName: string) {
    return this.registerForm.controls[controlName].invalid && this.registerForm.controls[controlName].touched
  }

  public hasError(controlName: string, errorName: string) {
    return this.registerForm.controls[controlName].hasError(errorName)
  }

  registerUser(formValues: any = {}) {


    const user: RegisterUser = {
      userName: formValues.userName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirmPassword
    };

    this.authService.registerUser(user).subscribe(
      _ => {
        window.location.href = "/";
      },
      error => {
        this.areErrors = true;
        this.errorList = error.error.errors;
      }
    )


  }

}