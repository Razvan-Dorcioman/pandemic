import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { CurrentUser } from '../models/current-user';
import { AuthenticationService } from 'src/services/authentication.service';
import Swal from 'sweetalert2';
import { GlobalConstants } from '../commons/global-constants';

interface Accounts {
  id?: number;
  username: string;
  password: string;
}

interface KeysCrypted {
  id?: number,
  name: string,
  publicKey: string
}

const KEYS = [
  {
    id: 1,
    name: "name1",
    publicKey: "val1",
  },
  {
    id: 2,
    name: "name2",
    publicKey: "val2",
  },
  {
    id: 3,
    name: "name3",
    publicKey: "val3",
  },
  {
    id: 4,
    name: "name4",
    publicKey: "val4",
  },
  {
    id: 5,
    name: "name5",
    publicKey: "val5",
  }
]

let ACCOUNTS = [];
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  user: CurrentUser;
  baseUrl: string;

  page = 1;
  pageSize = 2;
  collectionSize = ACCOUNTS.length;
  accounts: any;
  accountsType = 'passwords';

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') _baseUrl: string,
    private authService: AuthenticationService
  ) {
    this.baseUrl = GlobalConstants.baseUrl;
    this.getAccounts();
  }

  getAccounts() {
    if (this.accountsType === 'passwords') {
      this.authService.getPasswords().subscribe(
        (response: any) => {
          this.collectionSize = response.length;
          for (let account of response) {
            account.passStars = "**********";
          }
          ACCOUNTS = response;
          this.accounts = response;
          this.refreshAccounts();
        },
        error => {
          console.log('error');
        }
      )
    } else if (this.accountsType === 'cryptedKeys') {
      this.authService.getCryptedKeys().subscribe(
        (response: any) => {
          this.collectionSize = response.length;
          ACCOUNTS = response;
          this.accounts = response;
          this.refreshAccounts();
        },
        error => {
          console.log('error');
        }
      )
    }
  }

  select(accountsType: string) {
    this.accountsType = accountsType;
    this.getAccounts();
  }

  refreshAccounts() {
    this.accounts = ACCOUNTS
      .map((country, i) => ({ id: i + 1, ...country }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  ngOnInit(): void {
    this.user = localStorage.getItem("jwt");
  }

  showPassword(passId: string) {
    if (document.getElementById("show-hide-button").innerText == 'SHOW') {
      debugger;
      document.getElementById("show-hide-button").innerHTML = `<img  width="25px" height= "25px"  src="assets/svg/icon-loading.svg">`
      this.authService.getPasswordDecrypted(passId).subscribe(
        (response: any) => {
          ACCOUNTS.forEach(account => {
            if (account.id == passId) {
              account.passStars = response.password;
            }
          });
          this.accounts = ACCOUNTS;
          document.getElementById("show-hide-button").innerText = 'HIDE';
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error..',
            text: "Can't get the decrypted password."
          })
        })
    } else if (document.getElementById("show-hide-button").innerText == 'HIDE') {
      ACCOUNTS.forEach(account => {
        if (account.id == passId) {
          account.passStars = "**********";
        }
      });
      this.accounts = ACCOUNTS;
      document.getElementById("show-hide-button").innerText = 'SHOW';
    }
  }

  public openModalCreateNew() {
    if (this.accountsType === 'passwords') {

      Swal.fire({
        title: '<strong>Create new account with password</strong>',
        html:
          `<input type="text" id="applications" class="swal2-input" placeholder="Applications"/>
        <input type="text" id="userName" class="swal2-input" placeholder="Username"/>
        
        <div class="mt-3 row" style="width: 95%!important">
        
        <div class="col-md-8">
        <label for="length">Password Length:</label>
        </div>
        
        <div class="col-md-4" style="text-align:left !important">
        <input type="checkbox" class="form-check-input" id="uppecase" name="uppercase"/>
        <label for="uppercase" class="form-check-label">Uppercase</label>
        </div>
        
        </div>
        
        <div class="mt-3 row" style="width: 95%!important">
        
        <div class="col-md-8">
        <input type="number" name="length" id="password-length" value="12" min="8" max="50" step="1"></input>
        </div>
        
        <div class="col-md-4" style="text-align:left !important">
        <input type="checkbox" class="form-check-input" id="number" name="number"/>
        <label for="number" class="form-check-label">Number</label>
        </div>
        
        </div>
        
        <div class="mt-3 row" style="width: 95%!important">
        
        <div class="col-md-8">
        <input type="range" id="password-length-range" name="volume" for="length" value="12" class="form-range w-50" min="8" max="50"/>
        </div>
        
        <div class="col-md-4" style="text-align:left !important">
        <input type="checkbox" class="form-check-input" id="symbols" name="symbols"/>
        <label for="symbols" class="form-check-label">Symbols</label>
        </div>
        
        </div>
        
        
        <div>
        <button type="button" id="generate" class="btn btn-outline-success mt-3 w-25">Generate</button>
        <button type="button" id="copyPassword" class="btn btn-outline-success mt-3 w-25">Copy</button>
        </div>
        <input type="text" id="password" class="swal2-input mb-1" placeholder="Password"/>
        
        `,
        didOpen: () => {
          const inputRange: any = Swal.getHtmlContainer().querySelector('#password-length-range');
          let inputNumber: any = Swal.getHtmlContainer().querySelector('#password-length');
          inputNumber.style = ""
          // sync input[type=number] with input[type=range]
          inputRange.addEventListener('input', () => {
            inputNumber.value = inputRange.value
          })

          // sync input[type=range] with input[type=number]
          inputNumber.addEventListener('change', () => {
            if (inputNumber.value < 8) {
              inputNumber.value = 8;
            }
            if (inputNumber.value > 50) {
              inputNumber.value = 50;
            }
            inputRange.value = inputNumber.value
          })

          const generatebutton = Swal.getHtmlContainer().querySelector('#generate');
          generatebutton.addEventListener("click", () => {
            const uppercaseCheckbox: any = Swal.getHtmlContainer().querySelector('#uppecase');
            const numberCheckbox: any = Swal.getHtmlContainer().querySelector('#number');
            const symbolsCheckbox: any = Swal.getHtmlContainer().querySelector('#symbols');
            inputNumber = Swal.getHtmlContainer().querySelector('#password-length');

            const params = {
              length: inputNumber.value,
              upperCase: uppercaseCheckbox.checked,
              number: numberCheckbox.checked,
              nonAlphaNumericCharacter: symbolsCheckbox.checked
            }

            this.authService.generatePassword(params).subscribe(
              (response: any) => {
                const passwordInput: any = Swal.getHtmlContainer().querySelector('#password');
                passwordInput.value = response.res.result;
              },
              error => {
                console.log('error');
              }
            )
          })
        },
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: '#198754',
        confirmButtonText:
          'Add account',
        cancelButtonText:
          'Cancel',
        preConfirm: () => {

          const applicationsInput: any = Swal.getHtmlContainer().querySelector('#applications');
          const usernameInput: any = Swal.getHtmlContainer().querySelector('#userName');
          const passwordInput: any = Swal.getHtmlContainer().querySelector('#password');

          const params = {
            tags: applicationsInput.value,
            username: usernameInput.value,
            password: passwordInput.value
          }
          this.authService.addAccountsWithPasswords(params).subscribe(
            (response: any) => {
              this.getAccounts();
            },
            error => {
              console.log('error');
              Swal.fire({
                icon: 'error',
                title: 'Error..',
                text: "The account couln't be added."
              })
            }
          )
        },
      }).then((result: any) => {

      })

    } else if (this.accountsType === 'cryptedKeys') {
      Swal.fire({
        title: '<strong>Create new key</strong>',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: '#198754',
        confirmButtonText:
          'Add key',
        cancelButtonText:
          'Cancel',
        html: `<input type="text" id="keyName" class="swal2-input" placeholder="Key Name"/>
          <div>
            <label for="radioButtons" class="mt-3">Choose a key type:</label>
            <div class="row mt-3" style="width: 95%!important">
              <div class="col-md-4"></div>
              <div class="col-md-2 form-check">
                <input class="form-check-input" type="radio" name="keyTypeRadio" id="aes" checked>
                <label class="form-check-label" for="aes">AES</label>
              </div>
              <div class="col-md-1"></div>
              <div class="col-md-2 form-check">
                <input class="form-check-input" type="radio" name="keyTypeRadio" id="des">
                <label class="form-check-label" for="des">DES</label>
              </div>
            </div>

            <div class="row" style="width: 95%!important">
              <div class="col-md-4"></div>
              <div class="col-md-2 form-check">
                <input class="form-check-input" type="radio" name="keyTypeRadio" id="rsa">
                <label class="form-check-label" for="rsa">RSA</label>
              </div>
              <div class="col-md-1"></div>
              <div class="col-md-2 form-check">
                <input class="form-check-input" type="radio" name="keyTypeRadio" id="ec">
                <label class="form-check-label" for="ec">EC</label>
              </div>
            </div>
          
          </div>
          <div>
            <button type="button" id="generate" class="btn btn-outline-success mt-3 w-25">Generate</button>
          </div>
          <div id="inputs-crypted">
            <input type="text" id="key" class="swal2-input mb-1" placeholder="Crypted Key"/>
          </div>
          `,
        didOpen: () => {
          const oneInput = '<input type="text" id="key" class="swal2-input mb-1" placeholder="Crypted Key"/>';
          const twoInputs = `<input type="text" id="public-key" class="swal2-input mb-1" placeholder="Public Key"/>
          <input type="text" id="private-key" class="swal2-input" placeholder="Private Key"/>`;
          const radioButtons: any = Swal.getHtmlContainer().querySelectorAll('input[name="keyTypeRadio"]');

          for (let i = 0, max = radioButtons.length; i < max; i++) {
            radioButtons[i].onclick = function (event: any) {
              let inputsCrypted: any = Swal.getHtmlContainer().querySelector('#inputs-crypted');
              if (event.target.id == 'aes' || event.target.id == 'des') {
                inputsCrypted.innerHTML = oneInput;
              } else if (event.target.id == 'rsa' || event.target.id == 'ec') {
                inputsCrypted.innerHTML = twoInputs;
              }
            }
          }

          const generatebutton = Swal.getHtmlContainer().querySelector('#generate');
          generatebutton.addEventListener("click", () => {
            const radioChecked: any = Swal.getHtmlContainer().querySelector('input[name="keyTypeRadio"]:checked');
            let radioCheckedValue;
            switch (radioChecked.id) {
              case 'aes': radioCheckedValue = 0;
                break;
              case 'des': radioCheckedValue = 1;
                break;
              case 'rsa': radioCheckedValue = 2;
                break;
              case 'ec': radioCheckedValue = 3;
                break;
            }

            this.authService.generateKey(radioCheckedValue).subscribe(
              (response: any) => {
                if (radioCheckedValue == 0 || radioCheckedValue == 1) {
                  const cryptedKeyInput: any = Swal.getHtmlContainer().querySelectorAll('#key');
                  cryptedKeyInput.value = response.key;
                } else if (radioCheckedValue == 2 || radioCheckedValue == 3) {
                  const publicKeyInput: any = Swal.getHtmlContainer().querySelectorAll('#public-key');
                  const privateKeyInput: any = Swal.getHtmlContainer().querySelectorAll('#private-key');
                  publicKeyInput.value = response.key.public;
                  privateKeyInput.value = response.key.private;
                }
              },
              error => {
                console.log('error');
              }
            )
          })
        },
        preConfirm: () => {
          const radioChecked: any = Swal.getHtmlContainer().querySelector('input[name="keyTypeRadio"]:checked');
          const keyNameInput: any = Swal.getHtmlContainer().querySelectorAll('#keyName');
          let params = {};
          if (radioChecked == 'aes' || radioChecked == 'des') {
            const cryptedKeyInput: any = Swal.getHtmlContainer().querySelectorAll('#key');
            params = {
              name: keyNameInput.value,
              privateKey: '',
              publicKey: cryptedKeyInput.value,
              type: radioChecked == 'aes' ? 0 : 1
            }
          } else if (radioChecked == 'rsa' || radioChecked == 'ec') {
            const publicKeyInput: any = Swal.getHtmlContainer().querySelectorAll('#public-key');
            const privateKeyInput: any = Swal.getHtmlContainer().querySelectorAll('#private-key');
            params = {
              name: keyNameInput.value,
              privateKey: privateKeyInput.value,
              publicKey: publicKeyInput.value,
              type: radioChecked == 'rsa' ? 2 : 3
            }
          }

          this.authService.addAccountsWithKeys(params).subscribe(
            (response: any) => {
              return response.json();
            },
            error => {
              console.log('error');
            }
          )
        }
      }).then((result: any) => {

      })
    }

  }

}