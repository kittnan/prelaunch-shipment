
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'app/api.service';
import { AlertServiceService } from '../service/alert-service.service';
import { AuthGuardService } from '../service/auth-guard.service';

@Component({
  selector: 'app-model-master',
  templateUrl: './model-master.component.html',
  styleUrls: ['./model-master.component.css']
})
export class ModelMasterComponent implements OnInit {

  constructor(
    private api: ApiService,
    private alertSwal: AlertServiceService,
    private route: Router,
    private auth: AuthGuardService,


  ) { }

  ModelForm = new FormGroup({
    ModelCode: new FormControl(null, Validators.required),
    Size: new FormControl(null, Validators.required),
    CustomerName: new FormControl(null, Validators.required),
    CustomerNo: new FormControl(null, Validators.required),
    PartName: new FormControl(null, Validators.required),
    PatternLabelId: new FormControl(null, Validators.required),
  })
  get ModelCode() { return this.ModelForm.get('ModelCode') }
  get Size() { return this.ModelForm.get('Size') }
  get CustomerName() { return this.ModelForm.get('CustomerName') }
  get CustomerNo() { return this.ModelForm.get('CustomerNo') }
  get PartName() { return this.ModelForm.get('PartName') }
  get PatternLabelId() { return this.ModelForm.get('PatternLabelId') }
  // get Size() { return this.RequestForm.get('Size') }


  // * API
  ModelMasterLists: any
  MasterSize: any;
  MasterShipmentPlace: any;
  MasterCustomer: any;
  MasterPartName: any;
  MasterPattern: any;

  // * parameter css
  ValidCss: any = "form-tab-red";

  ngOnInit(): void {
    this.auth.CheckAuth()
    this.setMasterList()
  }

  getModelMaster() {
    return new Promise((resolve) => {
      this.api.getModelMasters().subscribe((data) => {
        resolve(data)
      })
    })
  }


  insertModelMaster() {
    const data = this.ModelForm.value
    return new Promise((resolve) => {
      this.api.insertModelMaster(data).subscribe((data: any) => {
        resolve(data)
      })

    })
  }

  async onAddModelMaster() {
    this.ModelMasterLists = await this.getModelMaster();
    const result = this.ModelMasterLists.find(list => list.ModelCode == this.ModelCode.value)
    if (!result) {
      const resultInsert = await this.insertModelMaster();
      if (resultInsert) {
        this.alertSwal.alert('success', 'Add new model success')

        this.ModelForm.reset();
      } else {
        this.alertSwal.alert('error', 'Insert error !!')

      }
    } else {
      this.alertSwal.alert('error', 'Model Code is Duplicate !!')
    }

  }

  onClickManage() {
    this.route.navigate(['/model-master-manage'])
    // location.href = "#/model-master-manage"
  }

  async setMasterList() {
    let Listall: any = await this.getMasterListAll();
    if (Listall.length != 0) {
      //                                           (Listall);
      this.MasterSize = Listall.find(item=>item.MasterName == "Size")
      // this.MasterShipmentPlace = Listall.find(item=>item.MasterName == "Shipment Place")
      this.MasterCustomer = Listall.find(item=>item.MasterName == "Customer")
      this.MasterPartName = Listall.find(item=>item.MasterName == "PartName")
    }
    this.MasterPattern =  await this.getMasterPattern();
    //                                           (this.MasterPattern);
    
  }

  getMasterListAll() {
    return new Promise((resolve) => {
      this.api.getMasters().subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  
  getMasterPattern(){
    return new Promise((resolve)=>{
      this.api.getPattern().subscribe((data:any)=>{
        resolve(data)
      })
    })
  }





}
