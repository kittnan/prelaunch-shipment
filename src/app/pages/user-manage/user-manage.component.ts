import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'app/api.service';
import Swal from 'sweetalert2';
import { AuthGuardService } from '../service/auth-guard.service';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {

  constructor(
    private api: ApiService,
    private modal: NgbModal,
    config: NgbModalConfig,
    private auth: AuthGuardService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  Users: any = []
  UsersShow: any = []
  tempEventChangeFilter: any;

  AddUserForm = new FormGroup({
    EmployeeCode: new FormControl('', [Validators.required, Validators.minLength(8)]),
    FirstName: new FormControl('', Validators.required),
    LastName: new FormControl('', Validators.required),
    Password: new FormControl(''),
    Email: new FormControl('', [Validators.email, Validators.required]),
    Status: new FormControl('', Validators.required)
  })

  UpdateUserForm = new FormGroup({
    id: new FormControl(),
    EmployeeCode: new FormControl('', [Validators.required, Validators.minLength(8)]),
    FirstName: new FormControl('', Validators.required),
    LastName: new FormControl('', Validators.required),
    Password: new FormControl(''),
    Email: new FormControl('', [Validators.email, Validators.required]),
    Status: new FormControl('', Validators.required)
  })

  get AddUserFormControl() {
    return this.AddUserForm.controls;
  }
  get UpdateUserFormControl() {
    return this.UpdateUserForm.controls;
  }



  ngOnInit(): void {
    this.auth.CheckAuth()
    this.onStartPage()
  }

  async onStartPage() {
    try {
      this.Users = await this.getUsers()
    } catch (error) {

    }
  }

  getUsers() {
    return new Promise((resolve, reject) => {
      this.api.getUsers().subscribe(r => {
        r.length > 0 ? resolve(r) : reject('error can not get users')
      })
    })
  }

  async onChangeFilter(event: any) {
    const key = event.target.value
    this.tempEventChangeFilter = event
    if (key == 'all') {
      this.UsersShow = this.Users
    } else {
      try {
        this.UsersShow = await this.mapUserShow(key, this.Users)
      } catch (error) {
        this.SweetToast('warning', error)
      }


    }
  }

  mapUserShow(key: any, users: any) {
    return new Promise((resolve, reject) => {
      const result_map: any = users.filter(user => {
        if (user.Status == key) return user
      })

      if (result_map.length > 0) {

        resolve(result_map)
      } else {
        reject('not found')
      }

    })
  }

  onClickAddUser(content) {
    this.modal.open(content, { size: 'lg' })
  }

  async onSubmitAddUser() {
    try {
      this.AddUserFormControl.Password.setValue(this.AddUserFormControl.EmployeeCode.value)
      await this.insertUser()
      this.AddUserForm.reset()

      this.Users = await this.getUsers()
      this.onChangeFilter(this.tempEventChangeFilter)
      this.SweetToast('success', 'Insert new user')
    } catch (error) {
      this.SweetToast('error', error)

    }
  }

  insertUser() {
    return new Promise((resolve, reject) => {
      this.api.insertUser(this.AddUserForm.value).subscribe((res: any) => {
        if (res.length > 0) {
          resolve(res)
        } else {
          reject('error insert new user')
        }
      })
    })

  }

  onClickUpdateUser(content, item) {
    this.UpdateUserForm.setValue({
      id: item._id,
      EmployeeCode: item.EmployeeCode ? item.EmployeeCode : "",
      FirstName: item.FirstName ? item.FirstName : "",
      LastName: item.LastName ? item.LastName : "",
      Password: item.EmployeeCode ? item.EmployeeCode : "",
      Email: item.Email ? item.Email : "",
      Status: item.Status ? item.Status : "",
    })
    this.modal.open(content, { size: 'lg' })
  }


  async onSubmitUpdateUser() {

    try {
      await this.updateUser(this.UpdateUserFormControl.id.value, this.UpdateUserForm.value)
      this.Users = await this.getUsers()
      this.onChangeFilter(this.tempEventChangeFilter)
      this.SweetToast('success', 'Update user')

    } catch (error) {
      this.SweetToast('error', error)
    }
  }

  updateUser(id: any, data: any) {
    return new Promise((resolve, reject) => {
      this.api.updateUser(id, data).subscribe((res: any) => {
        if (res.modifiedCount > 0 ) {
          resolve(true)
        } else {
          reject('error update user')
        }
      })
    })
  }

  onClickDeleteUser(item) {
    Swal.fire({
      title: 'Do you want to delete ?',
      text: `Delete EmployeeCode: ${item.EmployeeCode} FirstName: ${item.FirstName} LastName: ${item.LastName}`,
      icon: 'question',
      showCancelButton: true
    }).then(async r => {
      if (r.isConfirmed) {
        try {
          await this.deleteUser(item._id)
          this.Users = await this.getUsers()
          this.onChangeFilter(this.tempEventChangeFilter)
          this.SweetToast('success', 'Delete user')
        } catch (error) {
          this.SweetToast('error', error)
        }
      }
    })
  }

  deleteUser(id: any) {
    return new Promise((resolve, reject) => {
      this.api.deleteUser(id).subscribe(res => {
        if (res.deletedCount > 0 ) {
          resolve(true)
        } else {
          reject('error delete user')
        }
      })
    })
  }

  SweetToast(icon, title) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: icon,
      title: title
    })
  }


}
