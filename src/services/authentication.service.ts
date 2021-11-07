import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterUser } from 'src/app/models/register-user';
import { LoginUser } from 'src/app/models/login-user';
import { GlobalConstants } from 'src/app/commons/global-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl: string;

  constructor(private http: HttpClient,
    @Inject('BASE_URL') _baseUrl: string,
  ) {
    this.baseUrl = GlobalConstants.baseUrl;
  }

  public registerUser(registerUser: RegisterUser) {
    return this.http.post(this.baseUrl + "/auth/register", registerUser);
  }

  public loginUser(loginUser: LoginUser) {
    return this.http.post(this.baseUrl + "/auth/login", loginUser);
  }

  public generatePassword(params: object) {
    return this.http.post(this.baseUrl + "/CryptoStorage/generatePassword", params, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
  }

  public generateKey(type) {
    return this.http.get(this.baseUrl + "/CryptoStorage/generateKey/" + type, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
        'Access-Control-Allow-Origin': 'http://localhost:4200'
      }
    })
  }

  addAccountsWithPasswords(params: object) {
    return this.http.post(this.baseUrl + "/CryptoStorage/AddPassword", params, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
  }

  getPasswords() {
    return this.http.get(this.baseUrl + "/CryptoStorage/GetPasswords", {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
  }

  getCryptedKeys() {
    return this.http.get(this.baseUrl + "/CryptoStorage/GetKeys", {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
  }

  getPasswordDecrypted(passId) {
    return this.http.get(this.baseUrl + `/CryptoStorage/getPassword/` + passId, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
  }

  addAccountsWithKeys(params: object) {
    return this.http.post(this.baseUrl + "/CryptoStorage/AddKey", params, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
  }

  deletePassword(id: string) {
    return this.http.delete(this.baseUrl + "/CryptoStorage/deletePassword/" + id, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
  }

  deleteKey(id: string) {
    return this.http.delete(this.baseUrl + "/CryptoStorage/deleteKey/" + id, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
  }
}
