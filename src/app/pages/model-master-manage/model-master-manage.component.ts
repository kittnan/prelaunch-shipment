import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'app/api.service';
import Swal from 'sweetalert2'
import { AlertServiceService } from '../service/alert-service.service';
import { AuthGuardService } from '../service/auth-guard.service';


@Component({
  selector: 'app-model-master-manage',
  templateUrl: './model-master-manage.component.html',
  styleUrls: ['./model-master-manage.component.css']
})
export class ModelMasterManageComponent implements OnInit {

  constructor(
    private api: ApiService,
    private alertSwal: AlertServiceService,
    private modal: NgbModal,
    private auth: AuthGuardService,
  ) { }

  ModelForm = new FormGroup({
    _id: new FormControl(null, Validators.required),
    ModelCode: new FormControl(null, Validators.required),
    Size: new FormControl(null, Validators.required),
    CustomerName: new FormControl(null, Validators.required),
    CustomerNo: new FormControl(null, Validators.required),
    PartName: new FormControl(null, Validators.required),
    PatternLabelId: new FormControl(null, Validators.required),

  })
  get _id() { return this.ModelForm.get('_id') }
  get ModelCode() { return this.ModelForm.get('ModelCode') }
  get Size() { return this.ModelForm.get('Size') }
  get CustomerName() { return this.ModelForm.get('CustomerName') }
  get CustomerNo() { return this.ModelForm.get('CustomerNo') }
  get PartName() { return this.ModelForm.get('PartName') }
  get PatternLabelId() { return this.ModelForm.get('PatternLabelId') }

  // * API  result parameter
  ModelMaster: any
  PatternMaster: any;
  ngOnInit(): void {
    this.auth.CheckAuth()
    this.onStartPage();
  }

  async onStartPage() {
    this.ModelCode.value

    const models = await this.getModelMaster();
    this.PatternMaster = await this.getPatternLabelAll();
    this.ModelMaster = await this.setPatterName(models, this.PatternMaster)

  }

  getModelMaster() {
    return new Promise((resolve) => {
      this.api.getModelMasters().subscribe((data) => {
        resolve(data)
      })
    })
  }
  getPatternLabelAll() {
    return new Promise((resolve) => {
      this.api.getPattern().subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  getBox() {
    return new Promise(resolve => {
      this.api.getBoxsAll().subscribe((response: any) => {
        resolve(response)
      })
    })
  }

  setPatterName(models, patterns) {
    return new Promise((resolve) => {
      models.map((model: any) => {
        const temp = patterns.find(i => i._id == model.PatternLabelId)
        if (temp) {
          return model['PatternName'] = temp.PatternName
        }
      })
      resolve(models)
    })
  }

  openModalEdit(content, item) {
    this.ModelForm.reset();

    this._id.setValue(item._id)
    this.ModelCode.setValue(item.ModelCode)
    this.Size.setValue(item.Size)
    this.CustomerName.setValue(item.CustomerName)
    this.CustomerNo.setValue(item.CustomerNo)
    this.PartName.setValue(item.PartName)
    this.PatternLabelId.setValue(item.PatternLabelId)

    this.modal.open(content, { size: 'lg' })
  }

  async onClickEdit2() {
    let result: any = await this.updateModelMaster();
    if (result.modifiedCount == 1) {
      const models = await this.getModelMaster();
      this.ModelMaster = await this.setPatterName(models, this.PatternMaster)
      this.alertSwal.alert('success', 'Success')

      this.modal.dismissAll()
    }
  }
  updateModelMaster() {
    return new Promise((resolve) => {
      this.api.updataModelMaster(this._id.value, this.ModelForm.value).subscribe(async (data: any) => {
        resolve(data)
      })
    })
  }

  onClickEdit() {

    return new Promise((resolve) => {
      if (this.ModelMaster.find(item => item.ModelCode == this.ModelCode.value)) {
        this.alertSwal.alert('error', 'Model Code is Duplicate !!')

      } else {
        this.api.updataModelMaster(this._id.value, this.ModelForm.value).subscribe(async (data: any) => {
          if (data.modifiedCount == 1) {
            this.ModelMaster = await this.getModelMaster();
            this.alertSwal.alert('success', 'Success')

            this.modal.dismissAll()
          }
        })

      }

    })
  }
  onClickDelete(item) {

    Swal.fire({
      title: "Do you want to delete?",
      text: `Delete model code: ${item.ModelCode}`,
      showConfirmButton: true,
      showCancelButton: true,
      icon: 'question'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const checkModelInBox = await this.checkModelInBoxs(item.ModelCode)
        if (checkModelInBox == undefined) {
          const itemId = item._id
          const response: any = await this.deleteModel(itemId)
          if (response.deletedCount == 1) {
            this.ModelMaster = await this.getModelMaster()
            this.alertSwal.alert('success', 'Success')

          }
        }else{
          this.alertSwal.alert('error', 'Model is using')
        }

      }
    })

  }
  checkModelInBoxs(modelCode: any) {
    return new Promise(async resolve => {
      const getBox: any = await this.getBox()
      const temp = getBox.find(box => box.ModelCode == modelCode)
      resolve(temp)
    })
  }
  deleteModel(itemId) {
    return new Promise(resolve => {
      this.api.deleteModelMaster(itemId).subscribe((data: any) => {
        resolve(data)
      })
    })
  }


}
