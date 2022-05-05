import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from 'app/pages/service/auth-guard.service';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {


  loginStatus: any;

  constructor(
    private route: Router,
    private auth: AuthGuardService
  ) {

  }

  ngOnInit() {
    this.loginStatus = localStorage.getItem('loginStatus');
    if (localStorage.getItem('loginStatus') != 'true') {
      this.route.navigate(['/login'])
      // location.href="#/login"
    }else{
      this.auth.CheckAuth()
    }
  }

}
