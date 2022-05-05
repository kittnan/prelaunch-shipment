import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'app/api.service';
import Swal from 'sweetalert2';
import { AlertServiceService } from '../service/alert-service.service';
import { AuthGuardService } from '../service/auth-guard.service';

@Component({
  selector: 'app-request-shipment',
  templateUrl: './request-shipment.component.html',
  styleUrls: ['./request-shipment.component.css']
})
export class RequestShipmentComponent implements OnInit {

  constructor(
    private api: ApiService,
    private modal: NgbModal,
    private alertSwal: AlertServiceService,
    private route: Router,
    private auth: AuthGuardService

  ) { }

  ShipmentForm = new FormGroup({
    ShipDate: new FormControl('', Validators.required),
    ShipPlace: new FormControl('', Validators.required),
    ShipTo: new FormControl('', Validators.required),
    CPRno: new FormControl('', Validators.required),
    User: new FormControl(`${localStorage.getItem('FirstName')}-${localStorage.getItem('LastName')}`),
    Status: new FormControl(0)
  })
  get ShipmentFormControl() {
    return this.ShipmentForm.controls
  }

  AddBoxForm = new FormGroup({
    Name: new FormControl(1, Validators.required),
    TotalQty: new FormControl('', Validators.required),
    Models: new FormControl([]),

  })
  get AddBoxFormControl() {
    return this.AddBoxForm.controls
  }


  // * master
  MasterShipmentPlace: any;
  ModelMasterLists: any

  // * Date
  MinShipmentDate: any

  // * newBox
  NewBox: any = []

  // * temp
  tempIndexNewBox: any

  // * TTL
  TTL: any = 'AUTO'

  async ngOnInit(): Promise<void> {
    this.auth.CheckAuth()
    try {
      this.MinShipmentDate = await this.setMinShipmentDate()
      const masterAll = await this.getMasterAll()
      this.MasterShipmentPlace = await this.setShipmentPlaceMaster(masterAll)
      this.ModelMasterLists = await this.getModelMaster()
      // console.log(this.ModelMasterLists);

    } catch (error) {
      alert(error)
    }
  }

  // todo set on  start page
  setMinShipmentDate() {
    return new Promise((resolve, reject) => {
      const date = new Date().toLocaleDateString('en-GB');
      const date1 = date.split('/')
      const minDateResult = `${date1[2]}-${date1[1]}-${date1[0]}`
      minDateResult ? resolve(minDateResult) : reject('set min date error')
    })
  }

  getMasterAll() {
    return new Promise((resolve, reject) => {
      this.api.getMasters().subscribe((res => {
        res.length > 0 ? resolve(res) : reject('get master error')
      }))
    })
  }

  setShipmentPlaceMaster(masterAll) {
    return new Promise((resolve, reject) => {
      const masterShipmentPlace = masterAll.find(master => master.MasterName == "Shipment Place")
      masterShipmentPlace ? resolve(masterShipmentPlace) : reject('set shipment place master error')
    })
  }
  getModelMaster() {
    return new Promise((resolve, reject) => {
      this.api.getModelMasters().subscribe((data: any) => {
        data.length > 0 ? resolve(data) : reject('get model master error')
      })
    })
  }


  // todo event
  onClickManage() {
    this.route.navigate(['/request-shipment-manage'])

    // location.href = "#/request-shipment-manage"
  }

  // todo add new box
  onClickAddBox() {
    Swal.fire({
      title: 'Do you want to add new box ?',
      icon: 'question',
      showCancelButton: true
    }).then(r => {
      if (r.isConfirmed) {
        this.NewBox.push(this.AddBoxForm.value)
        this.AddBoxForm.reset({
          Models: [],
          Name: this.NewBox.length + 1
        })
      }
    })

  }


  // todo add new model 
  onClickAddModel(content, indexBox) {
    this.tempIndexNewBox = indexBox

    this.modal.open(content, { size: 'xl' })
  }

  onClickModel(item) {
    Swal.fire({
      title: `Do you have add model: ${item.ModelCode} ?`,
      icon: 'question',
      showCancelButton: true
    }).then((r) => {
      if (r.isConfirmed) {
        this.modal.dismissAll()
        this.onAddModel(item)
      }
    })
  }

  async onAddModel(item) {
    const { value: qtyNum } = await Swal.fire({
      title: 'Enter your qty',
      input: 'number',
      inputLabel: 'Qty',
      inputPlaceholder: 'Enter your qty',
    })

    if (qtyNum && qtyNum != 0) {

      try {
        await this.checkTotalQty(qtyNum)
        Swal.fire(`Entered qty: ${qtyNum}`)
        let { ...newModel } = item
        newModel['Qty'] = qtyNum
        newModel['PatternName'] = item.pattern[0].PatternName
        newModel['ModelId'] = item._id
        newModel = { ...newModel, ...item }
        delete newModel._id
        this.NewBox[this.tempIndexNewBox].Models.push(newModel)
      } catch (error) {
        Swal.fire({
          title: error,
          icon: 'error',
        })
      }
    } else {
      Swal.fire({
        title: 'Something it wrong !',
        icon: 'warning',
      })
    }
  }

  checkTotalQty(qtyNum: number) {
    return new Promise((resolve, reject) => {
      const box = this.NewBox[this.tempIndexNewBox]
      const totalQty: number = box.Models.reduce((prev, now) => {
        return prev + Number(now.Qty)
      }, 0)


      if ((Number(qtyNum) + totalQty) <= box.TotalQty) {
        resolve(true)
      } else {
        reject('Count qty of new model over total box')
      }

    })
  }

  // todo delete box
  onClickDeleteBox(box, indexBox) {
    Swal.fire({
      title: `Do you want to delete box: ${box.Name} / TotalQty: ${box.TotalQty}`,
      icon: 'question',
      showCancelButton: true
    }).then(async r => {
      if (r.isConfirmed) {
        try {
          await this.onDeleteBox(indexBox)
          Swal.fire('Delete success !')
        } catch (error) {
          Swal.fire({
            title: error,
            icon: 'warning',
          })
        }
      }
    })
  }

  onDeleteBox(indexBox) {
    return new Promise((resolve, reject) => {
      const temp = this.NewBox.splice(indexBox, 1)
      temp ? resolve(true) : reject('error it wrong')
    })
  }

  // todo delete model
  onClickDeleteModel(model, indexModel, indexBox) {
    Swal.fire({
      title: `Do you want to delete model: ${model.ModelCode} / qty: ${model.Qty}`,
      icon: 'question',
      showCancelButton: true
    }).then(async r => {
      if (r.isConfirmed) {
        try {
          await this.onDeleteModel(indexModel, indexBox)
          Swal.fire('Delete success !')
        } catch (error) {
          Swal.fire({
            title: error,
            icon: 'warning',
          })
        }
      }
    })
  }
  onDeleteModel(indexModel, indexBox) {
    return new Promise((resolve, reject) => {
      const temp = this.NewBox[indexBox].Models.splice(indexModel, 1)
      temp ? resolve(true) : reject('error it wrong')
    })
  }




  checkTotalQtyNow(box) {
    const countTotalNow = box.Models.reduce((prev, now) => {
      return prev + Number(now.Qty)
    }, 0)
    return countTotalNow
  }

  // todo onClick Submit
  onClickSubmit() {

    Swal.fire({
      title: 'Do you have to submit ?',
      icon: 'question',
      showCancelButton: true
    }).then(async r => {
      if (r.isConfirmed) {
        try {
          const shipment: any = await this.onInsertShipment(this.ShipmentForm.value)
          const mapResult: any = await this.mapNewBox(this.NewBox, shipment[0]._id)
          await this.onInsertBox(mapResult)
          Swal.fire('Success')
          this.resetForm()
        } catch (error) {
          this.alertSwal.alert('error', error)
        }
      }
    })
  }

  onInsertShipment(data: object) {
    return new Promise((resolve, reject) => {
      this.api.insertRequestShipment(data).toPromise().then(res => {
        res ? resolve(res) : reject('error insert request shipment')
      })
    })
  }

  mapNewBox(newBox: Array<object>, shipmentId: string) {
    return new Promise((resolve, reject) => {
      const temp = newBox.map((box: any) => {
        box['ShipmentId'] = shipmentId
        box['Status'] = 0
        return box
      })
      temp ? resolve(temp) : reject('error map data')
    })
  }


  onInsertBox(newBoxs: Array<object>) {
    return new Promise((resolve, reject) => {
      this.api.insertBoxs(newBoxs).toPromise().then(res => {
        res ? resolve(res) : reject('error insert box')
      })
    })
  }

  resetForm() {
    this.ShipmentForm.setValue({
      ShipDate: '',
      ShipPlace: '',
      ShipTo: '',
      CPRno: '',
      User: `${localStorage.getItem('FirstName')}-${localStorage.getItem('LastName')}`,
      Status: 0
    })

    this.AddBoxForm.setValue({
      Name: '1',
      TotalQty: '',
      Models: []
    })
    this.NewBox = []
    this.tempIndexNewBox = ''
  }

  async onChangeShipDateAndCPRno() {

    if (this.ShipmentFormControl.ShipDate.valid && this.ShipmentFormControl.CPRno.valid) {
      try {
        const resultSearch: any = await this.onShipmentSearch()

        if (resultSearch.length > 0 && resultSearch[0].boxs.length > 0) {
          const resultTotalTTL = await this.onCountTTL(resultSearch)
          this.TTL = resultTotalTTL
        } else {
          this.TTL = 0
        }
      } catch (error) {
        this.alertSwal.alert('error', error)
      }
    } else {
      this.TTL = 'AUTO'
    }


  }
  onShipmentSearch() {
    return new Promise((resolve, reject) => {
      this.api.searchShipmentAndLookup({
        ShipMentDate: this.ShipmentFormControl.ShipDate.value,
        CPRno: this.ShipmentFormControl.CPRno.value,
        ModelCode: ''
      }).subscribe((d => {
        d ? resolve(d) : reject('error can not search')
      }))
    })
  }
  onCountTTL(rows) {
    return new Promise((resolve, reject) => {
      const total = rows.reduce((prev, now) => {
        const sumBox = now.boxs.reduce((prev, now) => {
          return prev + Number(now.TotalQty)
        }, 0)
        return prev + Number(sumBox)
      }, 0)
      total ? resolve(total) : reject('error onCountTTL')
    })
  }
}
