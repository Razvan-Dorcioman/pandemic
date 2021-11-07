import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { CurrentUser } from '../../authentication/models/currentUser';
// import { AuthenticationService } from '../../services/authentication.service';
import { CurrentUser } from '../models/current-user';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  user: CurrentUser;

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
    this.user = localStorage.getItem("jwt");
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logOut() {
    localStorage.removeItem("jwt");
  }
}