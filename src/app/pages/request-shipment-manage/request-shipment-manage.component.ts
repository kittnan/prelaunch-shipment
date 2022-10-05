import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'app/api.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AlertServiceService } from '../service/alert-service.service';
import { AuthGuardService } from '../service/auth-guard.service';
import { MapDataService } from '../service/map-data.service';
@Component({
  selector: 'app-request-shipment-manage',
  templateUrl: './request-shipment-manage.component.html',
  styleUrls: ['./request-shipment-manage.component.css']
})
export class RequestShipmentManageComponent implements OnInit {

  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private alertSwal: AlertServiceService,
    private serviceMap: MapDataService,
    private auth: AuthGuardService
  ) { }

  ModelCodeSearch = new FormControl(null)
  ShipMentDateSearch = new FormControl(null)
  CPRnoSearch = new FormControl(null)

  ModelMasterLists: any;
  PatternLabelsAll: any;
  RequestShipmentLists: any = [];
  RequestShipmentId: string;

  MasterShipmentPlace: any;


  RequestForm = new FormGroup({
    _id: new FormControl(null, Validators.required),
    ShipDate: new FormControl(null, Validators.required),
    CPRno: new FormControl([], Validators.required),
    ShipPlace: new FormControl(null, Validators.required),
    ShipTo: new FormControl(null, Validators.required),
    User: new FormControl(null),
  })
  get RequestFormControl() { return this.RequestForm.controls }




  ModalEditForm = new FormGroup({
    Modal_ModelCode: new FormControl(null, Validators.required),
    Modal_CustomerName: new FormControl('auto'),
    Modal_CustomerNo: new FormControl('auto'),
    Modal_Size: new FormControl('auto'),
    Modal_PartName: new FormControl('auto'),
    Modal_PatternName: new FormControl('auto'),
  })
  get ModalEditFormControl() { return this.ModalEditForm.controls }

  ModalEditDetailBoxForm = new FormGroup({
    TotalQty: new FormControl(''),
    _id: new FormControl(''),
  })
  get ModalEditDetailBoxFormControl() { return this.ModalEditDetailBoxForm.controls }


  ModalEditModelForm = new FormGroup({
    _id: new FormControl(''),
    ModelCode: new FormControl(''),
    Size: new FormControl(''),
    CustomerName: new FormControl(''),
    CustomerNo: new FormControl(''),
    PartName: new FormControl(''),
    Qty: new FormControl(''),
    PatternName: new FormControl(''),
    ModelId: new FormControl(''),
    MinQty: new FormControl('')

  })

  get ModalEditModelFormControl() { return this.ModalEditModelForm.controls }

  ModalAddNewModelForm = new FormGroup({
    ModelCode: new FormControl(''),
    Size: new FormControl(''),
    CustomerName: new FormControl(''),
    CustomerNo: new FormControl(''),
    PartName: new FormControl(''),
    Qty: new FormControl(''),
    PatternName: new FormControl(''),
    ModelId: new FormControl('')

  })
  get ModalAddNewModelFormControl() { return this.ModalAddNewModelForm.controls }


  // ! Modal View
  ModalView: any;
  ModalEdit: any;
  ModalEditBox: any


  // ! temp modal edit
  tempIndexModel: any
  tempBox: any

  // ! min Date
  MinShipmentDate: any

  async ngOnInit(): Promise<void> {
    this.auth.CheckAuth()
    this.setMasterList()
    this.MinShipmentDate = await this.setMinShipmentDate()
    const modelMaster = await this.getModelMaster()
    this.PatternLabelsAll = await this.getPatternLabels();
    this.ModelMasterLists = await this.setPatternName(modelMaster, this.PatternLabelsAll)
    const name = `${localStorage.getItem('FirstName')}-${localStorage.getItem('LastName')}`
    // this.User.setValue(name)
  }


  getModelMaster() {
    return new Promise((resolve) => {
      this.api.getModelMasters().subscribe((data: any) => {
        if (data.length != 0) {
          resolve(data)
        } else {
          resolve('no data')
        }
      })
    })
  }
  getPatternLabels() {
    return new Promise((resolve) => {
      this.api.getPattern().subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  setPatternName(datas, patterns) {
    return new Promise((resolve) => {
      const result = datas.map((data) => {
        const resultFind = patterns.find(pattern => pattern._id == data.PatternLabelId)
        if (resultFind) {
          data['PatternLabelName'] = resultFind.PatternName
          return data
        }
      })
      resolve(result)
    })
  }

  getMasterListAll() {
    return new Promise((resolve) => {
      this.api.getMasters().subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  async setMasterList() {
    let Listall: any = await this.getMasterListAll();
    if (Listall.length != 0) {
      this.MasterShipmentPlace = Listall.find(item => item.MasterName == "Shipment Place")

    }
  }
  setMinShipmentDate() {
    return new Promise((resolve, reject) => {
      const date = new Date().toLocaleDateString('en-GB');
      const date1 = date.split('/')
      const minDateResult = `${date1[2]}-${date1[1]}-${date1[0]}`
      minDateResult ? resolve(minDateResult) : reject('set min date error')
    })
  }

  async onSearch() {
    const data = {
      ModelCode: this.ModelCodeSearch.value || '',
      ShipMentDate: this.ShipMentDateSearch.value || '',
      CPRno: this.CPRnoSearch.value || ''
    }
    try {
      const result = await this.search(data)
      const newResultMap = await this.serviceMap.mapData(result)

      this.RequestShipmentLists = newResultMap

    } catch (error) {
      alert(error)
    }


  }
  search(data) {
    return new Promise((resolve) => {
      this.api.searchShipmentAndLookup(data).subscribe((data: any) => {
        if (data.length != 0) {
          const temp = data.map((item) => {
            // item.ShipDate = ((item.ShipDate).split('T'))[0]
            return item
          })
          resolve(data)
        } else {
          this.RequestShipmentLists = []
        }
      })
    })
  }

  getRequestShipment() {
    return new Promise((resolve, reject) => {
      this.api.getRequestShipment().subscribe((data: any) => {
        resolve(data)
      })
    })
  }

  // todo  modal view
  async openModalView(content, item) {
    try {
      this.ModalView = item

      this.modal.open(content, { size: 'xl', scrollable: true })
    } catch (error) {
      alert(error)
    }
  }
  onSubmitRequestShipment() {
    Swal.fire({
      title: 'Do you want to confirm shipment success !!',
      icon: 'question',
      showCancelButton: true
    }).then(r => {
      if (r.isConfirmed) {
        this.api.updateRequestShipment(this.ModalView._id, {
          Status: 1
        }).subscribe(r => {
          if (r) {
            this.modal.dismissAll();
            this.onSearch();
            this.alertSwal.alert('success', 'Confirm shipment success!!!!')
          }
        })
      }
    })


  }


  // todo modal edit
  async openModalEdit(content, item) {
    this.RequestForm.setValue({
      _id: item._id,
      ShipDate: item.ShipDate,
      CPRno: item.CPRno,
      ShipPlace: item.ShipPlace,
      ShipTo: item.ShipTo,
      User: item.User
    })

    this.ModalEdit = item.boxs


    this.modal.open(content, { size: 'xl', scrollable: true })
  }

  // todo modal edit -> save ship form
  onClickSaveDetailShipment() {
    Swal.fire({
      title: 'Do you have save request shipment form ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        try {
          await this.updateRequestShipment(this.RequestFormControl._id.value, this.RequestForm.value)
          this.alertSwal.alert('success', 'Updated')
        } catch (error) {
        }
      }
    })
  }

  // todo api edit request shipment
  updateRequestShipment(id: string, data: any) {
    return new Promise((resolve) => {
      this.api.updateRequestShipment(id, data).subscribe((data: any) => {
        resolve(data)
      })
    })
  }

  // todo modal edit -> click edit box
  onClickEditBox(content, box) {
    (box);
    this.ModalEditBox = box
    this.ModalEditDetailBoxFormControl.TotalQty.setValue(box.TotalQty)
    this.ModalEditDetailBoxFormControl._id.setValue(box._id)
    this.modal.open(content, { size: 'lg', scrollable: true })
  }

  // todo modal edit -> click edit box -> save
  async onSubmitEditBox() {
    (this.ModalEditDetailBoxForm.value);
    try {
      await this.onUpdateBox(this.ModalEditDetailBoxForm.value)
      this.alertSwal.alert('success', 'Updated')
      this.modal.dismissAll()
      this.onSearch()
    } catch (error) {

    }
  }
  // todo api onUpdate
  onUpdateBox(data) {
    return new Promise((resolve, reject) => {
      this.api.updateBox(data._id, data).toPromise().then(res => {
        res.modifiedCount > 0 ? resolve(true) : reject('error ...')
      })
    })
  }

  // todo modal edit -> click edit model
  onOpenModalEditModel(content, model, indexModel, box, indexBox) {
    const totalQtyBox = box.TotalQty
    const totalHaveInModels = box.Models ? box.Models.reduce((prev, now) => {
      return prev + Number(now.Qty)
    }, 0) : undefined
    const freeQty = (Number(totalQtyBox) - Number(totalHaveInModels)) + Number(model.Qty)

    this.ModalEditModelForm.setValue({
      _id: model._id,
      ModelCode: model.ModelCode,
      Size: model.Size,
      CustomerName: model.CustomerName,
      CustomerNo: model.CustomerNo,
      PartName: model.PartName,
      Qty: model.Qty,
      PatternName: model.PatternName,
      ModelId: model.ModelId,
      MinQty: freeQty
    })

    this.tempIndexModel = indexModel
    this.tempBox = box
    this.modal.open(content, { size: 'lg', scrollable: true })
  }



  // todo modal edit -> click edit model -> change model
  onChangeModel(event) {
    const findResult = this.ModelMasterLists.find(m => m.ModelCode == event)
    this.ModalEditModelForm.setValue({
      _id: this.ModalEditModelFormControl._id.value,
      ModelCode: findResult.ModelCode,
      Size: findResult.Size,
      CustomerName: findResult.CustomerName,
      CustomerNo: findResult.CustomerNo,
      PartName: findResult.PartName,
      Qty: this.ModalEditModelFormControl.Qty.value,
      PatternName: findResult.pattern[0].PatternName,
      ModelId: findResult._id
    })
  }

  // todo modal edit -> click edit model ->save
  async onSubmitEditModel() {
    try {
      this.tempBox.Models[this.tempIndexModel] = this.ModalEditModelForm.value
      await this.onUpdateModel(this.tempBox)
      this.alertSwal.alert('success', 'Updated')
    } catch (error) {
      alert(error)
    }
  }

  // todo modal edit -> click edit model ->save ->api
  onUpdateModel(box) {
    return new Promise((resolve, reject) => {
      this.api.updateBox(box._id, box).toPromise().then(r => {
        r.modifiedCount > 0 ? resolve(true) : reject('error ..')
      })
    })
  }

  // todo modal edit -> click delete model 
  onDeleteModel(box, indexModel) {
    Swal.fire({
      title: 'Do you want to delete ?',
      icon: 'question',
      showCancelButton: true
    }).then(async r => {
      if (r.isConfirmed) {
        box.Models.splice(indexModel, 1)
        await this.onUpdateModel(box)
        this.alertSwal.alert('success', 'Deleted')
      }
    })
  }


  // todo modal add new model
  onClickAddNewModel(content, box) {
    this.tempBox = box
    this.modal.open(content, { size: 'lg', scrollable: true })
  }

  // todo  modal add new model-> on change select model
  onChangeModelInAddNewModel(event) {
    const findResult = this.ModelMasterLists.find(m => m.ModelCode == event)
    this.ModalAddNewModelForm.setValue({
      ModelCode: findResult.ModelCode,
      Size: findResult.Size,
      CustomerName: findResult.CustomerName,
      CustomerNo: findResult.CustomerNo,
      PartName: findResult.PartName,
      Qty: this.ModalAddNewModelFormControl.Qty.value,
      PatternName: findResult.pattern[0].PatternName,
      ModelId: findResult._id
    })
  }

  // todo  modal add new model-> on add new model
  onSubmitAddNewModel() {
    Swal.fire({
      title: 'Do you want to add new model ?',
      icon: 'question',
      showCancelButton: true
    }).then(async r => {
      if (r.isConfirmed) {
        this.tempBox.Models.push(this.ModalAddNewModelForm.value)
        await this.onUpdateModel(this.tempBox)
        this.alertSwal.alert('success', 'Success')
        this.modal.dismissAll()
        this.onSearch()
      }
    })
  }

  // ? shipment table
  onClickDeleteShipment(requestShipMent, index) {
    Swal.fire({
      title: 'Do you want to delete ?',
      text: `Shipment date: ${requestShipMent.ShipDate} CPR no: ${requestShipMent.CPRno}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(async (r) => {
      if (r.isConfirmed) {

        try {
          await this.checkHistoryScan(requestShipMent)
          await this.onDeleteMultiBox(requestShipMent.boxs)
          await this.onDeleteShipment(requestShipMent)
          this.alertSwal.alert('success', 'Success')
          this.onSearch()
        } catch (error) {
          this.alertSwal.alert('error', error)
        }


      }
    })
  }

  // todo check histories before delete shipment
  checkHistoryScan(requestShipMent) {
    return new Promise((resolve, reject) => {
      requestShipMent.scanhistories.length == 0 ? resolve(true) : reject('error have histories')
    })
  }

  // todo delete multi box
  onDeleteMultiBox(boxs) {
    return new Promise((resolve, reject) => {
      boxs.forEach(box => {
        this.api.deleteBox(box._id).subscribe(d => {
          d.deletedCount > 0 ? resolve(true) : reject('error can not delete boxs')
        })
      });
    })
  }

  // todo api delete
  onDeleteShipment(shipment) {
    return new Promise((resolve, reject) => {
      this.api.deleteRequestShipment(shipment._id).subscribe(r => {
        r.deletedCount > 0 ? resolve(true) : reject('error can not delete request shipment')
      })
    })
  }


  setQty(box) {
    
    const sum = box.Models.reduce((prev, now) => {
      return prev + Number(now.Qty)
    }, 0)
    return `${sum} / ${box.TotalQty}`
  }


  // checkHistoryBoxByShipment(ShipmentId) {
  //   return new Promise(resolve => {
  //     this.api.checkHistoryByShipmentId(ShipmentId).subscribe((res => {
  //       resolve(res)
  //     }))
  //   })
  // }


  showNotification(from, align, types, text) {
    const color = types


    switch (color) {
      case 1:
        this.toastr.info(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Paper Dashboard Angular</b> - a beautiful bootstrap dashboard for every web developer.</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 2:
        this.toastr.success(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Success ${text}</b></span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 3:
        this.toastr.warning(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Warning ${text}</b></span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-warning alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 4:
        this.toastr.error(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Error ${text}</b></span>`,
          "",
          {
            timeOut: 4000,
            enableHtml: true,
            closeButton: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 5:
        this.toastr.show(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">?? ${text}</b></span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-primary alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      default:
        break;
    }
  }

}
