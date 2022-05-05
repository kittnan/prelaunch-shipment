import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'app/api.service';
import { AlertServiceService } from '../service/alert-service.service';
import { AuthGuardService } from '../service/auth-guard.service';

@Component({
  selector: 'app-change-password-protect-sheet',
  templateUrl: './change-password-protect-sheet.component.html',
  styleUrls: ['./change-password-protect-sheet.component.css']
})
export class ChangePasswordProtectSheetComponent implements OnInit {


  ToggleEdit: boolean = true;
  ProtectForm = new FormGroup({
    PasswordLabel: new FormControl('', [Validators.required]),
    PasswordSheet: new FormControl('', [Validators.required]),
  })

  get ProtectFormControl() {
    return this.ProtectForm.controls
  }

  oldProtectlabel: any
  oldProtectSheet: any

  constructor(
    private auth: AuthGuardService,
    private api: ApiService,
    private alertSwal: AlertServiceService
  ) { }

  

  async ngOnInit(): Promise<void> {
    this.auth.CheckAuth()
    const resultGetProtectSheet: any = await this.getProtectSheet()
    this.oldProtectlabel = resultGetProtectSheet.find(r => r.Name == 'Password-Label')
    this.oldProtectSheet = resultGetProtectSheet.find(r => r.Name == 'Password-Sheet')
    this.ProtectForm.setValue({
      PasswordLabel: this.oldProtectlabel.Password,
      PasswordSheet: this.oldProtectSheet.Password,
    })
  }

  getProtectSheet() {
    return new Promise((resolve, reject) => {
      this.api.getProtectSheet().subscribe(d => {
        d ? resolve(d) : reject('error')
      })
    })
  }

  onSaveSubmit() {
    if (this.ProtectFormControl.PasswordLabel.valid) {
      const data = {
        Password: this.ProtectFormControl.PasswordLabel.value || this.oldProtectlabel.Password,
        User: `${localStorage.getItem('FirstName')}-${localStorage.getItem('LastName')}/${localStorage.getItem('EmployeeCode')}` || this.oldProtectlabel.User,
      }
      this.onUpdateProtectSheet(this.oldProtectlabel._id, data)
    }

    if (this.ProtectFormControl.PasswordSheet.valid) {
      const data = {
        Password: this.ProtectFormControl.PasswordSheet.value || this.oldProtectSheet.Password,
        User: `${localStorage.getItem('FirstName')}-${localStorage.getItem('LastName')}/${localStorage.getItem('EmployeeCode')}` || this.oldProtectSheet.User,
      }
      this.onUpdateProtectSheet(this.oldProtectSheet._id, data)
    }

  }

  onUpdateProtectSheet(id, data) {
    this.api.updateProtectSheet(id, data).subscribe(d => {
      this.alertSwal.alert('success', 'Updated !!!')
      this.ngOnInit()
    })
  }



}