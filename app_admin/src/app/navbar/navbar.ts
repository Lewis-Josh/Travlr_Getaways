import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthenticationService } from '../services/authentication';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
  public loggedIn: boolean = false;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  public ngOnInit(): void {
    this.loggedIn = this.authenticationService.isLoggedIn();

    this.authenticationService.loggedInStatus$
      .subscribe((status: boolean) => {
        this.loggedIn = status;
      });
  }

  public onLogout(): void {
    this.authenticationService.logout();
    window.location.assign('/');
  }
}