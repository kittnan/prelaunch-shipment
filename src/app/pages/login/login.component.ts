import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api.service'
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public api: ApiService,
    private route: Router

  ) { }

  LoginForm = new FormGroup({
    UserName: new FormControl(null, Validators.required),
    PassWord: new FormControl(null, Validators.required),

  })
  User: any;
  async ngOnInit(): Promise<void> {
    this.checkLogIn()
    await this.getUser()
  }
  async checkLogIn() {
    if (localStorage.getItem('loginStatus') == 'true') {
      const url: any = await this.setPath({ Status: localStorage.getItem('Status') })
      this.route.navigate([url])
      // location.href = url
    }
  }

  async getUser() {
    this.api.getUsers().subscribe(async (users) => {
      if (users.length != 0) {
        this.User = await users
      }

    })
  }
  async onSubmit() {
    try {
      const user: any = await this.checkAccess()
      await this.setSession(user)
      const url: any = await this.setPath(user)
      // alert(url)
      if (url) {
        let Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        })
        Toast.fire('Login success', '', 'success').then(() => {
          this.route.navigate([url])
          // location.href = url
        })
      }
    } catch (error) {
      let Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      })
      Toast.fire({
        title: 'It Wrong !',
        icon: 'error'
      })
    }

  }

  checkAccess() {
    return new Promise((resolve, reject) => {
      const check: any = this.User.find((user: any) => {
        if (user.EmployeeCode === this.UserName.value && user.Password === this.PassWord.value) {
          return user
        } else {
          return false
        }
      })
      check != undefined ? resolve(check) : reject('login fail')
    })
  }


  setSession(user: any) {
    return new Promise((resolve, reject) => {
      if (user) {

        localStorage.setItem('loginStatus', "true");
        localStorage.setItem('FirstName', user.FirstName);
        localStorage.setItem('LastName', user.LastName);
        localStorage.setItem('EmployeeCode', user.EmployeeCode);
        localStorage.setItem('Email', user.Email);
        localStorage.setItem('Status', user.Status);
        resolve(true)
      } else {
        reject('can not set session')
      }
    })
  }
  setPath(user: any) {
    return new Promise((resolve, reject) => {

      if (user) {
        let url = ""
        const status: any = user.Status
        if (status == "admin") {
          url = "/model-master"
        } else
          if (status == "shipment") {
            url = "/request-shipment"
          } else
            if (status == "scan") {
              url = "/scan-labels"
            } else {
              reject('set path error')
            }
        resolve(url)
      } else {
        reject('set path error')
      }
    })
  }


  public get UserName() { return this.LoginForm.get('UserName') }
  public get PassWord() { return this.LoginForm.get('PassWord') }

}
