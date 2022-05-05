import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'app/api.service';
import Swal from 'sweetalert2';
import { AlertServiceService } from '../service/alert-service.service';
import { AuthGuardService } from '../service/auth-guard.service';

@Component({
  selector: 'app-master-manage',
  templateUrl: './master-manage.component.html',
  styleUrls: ['./master-manage.component.css']
})
export class MasterManageComponent implements OnInit {

  constructor(
    private api: ApiService,
    private modal: NgbModal,
    private alertSwal: AlertServiceService,
    private auth: AuthGuardService,

  ) { }

  MastersAll: any
  Lists: any
  Search = new FormControl(null, Validators.required)

  MasterName: any;
  Name = new FormControl(null, Validators.required)
  indexValue: any




  // get MasterName() { return this.MasterForm.get('MasterName') }


  async ngOnInit(): Promise<void> {
    this.auth.CheckAuth()
    this.MastersAll = await this.getMaster()
  }

  getMaster() {
    return new Promise((resolve) => {
      this.api.getMasters().subscribe((data: any) => {
        if (data.length != 0) {
          resolve(data)
        } else {
          alert('No Data')
        }
      })
    })
  }

  async onChangeSearchMaster() {
    if (this.MastersAll.length != 0) {
      this.Lists = await this.sortMaster(this.MastersAll)

    }
  }

  sortMaster(data) {
    return new Promise((resolve) => {
      const result = data.find(item => item.MasterName == this.Search.value)
      resolve(result)
    })
  }
  openModalEdit(content, item, index) {
    this.Name.setValue(item.Name)
    this.indexValue = index
    this.modal.open(content)
  }

  onEditList() {
    this.Lists.Value[this.indexValue].Name = this.Name.value
    const data = {
      Value: this.Lists.Value
    }
    this.api.updateMasters(this.Lists._id, data).subscribe((data: any) => {
      if (data.modifiedCount == 1) {
        this.Name.reset()
        this.alertSwal.alert('success', 'Success')
        this.modal.dismissAll()
      } else {
        this.alertSwal.alert('error', 'error')
      }

    })
  }

  onClickAddList(content) {
    this.Name.reset();
    this.MasterName = this.Lists.MasterName
    this.modal.open(content)
  }

  async onAddList() {
    const result = await this.checkAddlist()
    if (!result) {
      const temp = {
        Name: this.Name.value
      }
      const arr = this.Lists.Value
      const id = this.Lists._id
      arr.push(temp)
      const data = {
        Value: arr
      }
      this.api.updateMasters(id, data).subscribe((data: any) => {
        if (data.modifiedCount == 1) {
          this.Name.reset()
          this.alertSwal.alert('success', 'Success')

        } else {
          this.alertSwal.alert('error', 'error')

        }

      })
    } else {
      this.alertSwal.alert('error', 'duplicate name')
    }


  }
  checkAddlist() {
    return new Promise((resolve) => {
      const result = this.Lists.Value.find(item => item.Name == this.Name.value)
      resolve(result)
    })
  }

  onClickDelete(item, index) {
    Swal.fire({
      title: 'Do you want to delete ?',
      text: `delete name: ${item.Name} ?`,
      showConfirmButton: true,
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.Lists.Value.splice(index, 1)
        const data = {
          Value: this.Lists.Value
        }
        this.api.updateMasters(this.Lists._id, data).subscribe((data: any) => {
          if (data.modifiedCount == 1) {
            if (data.modifiedCount == 1) {
              this.alertSwal.alert('success', 'Success')

            } else {
              this.alertSwal.alert('error', '')

            }
          }
        })
      }
    })
  }




}
