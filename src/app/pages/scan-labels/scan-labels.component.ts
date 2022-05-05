import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'app/api.service';
import { AlertServiceService } from '../service/alert-service.service';
import { AuthGuardService } from '../service/auth-guard.service';
import { MapDataService } from '../service/map-data.service';

@Component({
  selector: 'app-scan-labels',
  templateUrl: './scan-labels.component.html',
  styleUrls: ['./scan-labels.component.css']
})
export class ScanLabelsComponent implements OnInit {

  constructor(
    private api: ApiService,
    private map: MapDataService,
    private alertSwal: AlertServiceService,
    private route: Router,
    private auth: AuthGuardService


  ) { }

  ResultSearch: any

  SearchForm = new FormGroup({
    ShipmentDate: new FormControl(null, Validators.required),
    CPRno: new FormControl(null, Validators.required),
    ModelCode: new FormControl(null, Validators.required)
  })

  RequestShipmentAll: any;
  ModelMasterAll: any
  // ResultSearch: any
  PatternAll: any

  CheckboxValue = [];
  // CheckboxStatus: boolean = false
  load :boolean = false
  async ngOnInit(): Promise<void> {
    this.load = true
    this.auth.CheckAuth()
    this.RequestShipmentAll = await this.getRequestShipment()
    this.ModelMasterAll = await this.getModelMaster();
    this.PatternAll = await this.getPatternAll();
    this.load = false
  }



  getRequestShipment() {
    return new Promise((resolve) => {
      this.api.getRequestShipment().subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  // getBoxs(body) {
  //   return new Promise((resolve) => {

  //     this.api.getBoxs(body).subscribe((data: any) => {
  //       resolve(data)
  //     })
  //   })
  // }
  getModelMaster() {
    return new Promise((resolve) => {
      this.api.getModelMasters().subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  getPatternAll() {
    return new Promise((resolve) => {
      this.api.getPattern().subscribe((data: any) => {
        resolve(data)
      })
    })
  }
  searchBoxs(body) {
    return new Promise((resolve) => {
      this.api.searchBoxs(body).subscribe((data: any) => {
        resolve(data)
      })
    })
  }









  async onSearch(e) {
    this.ResultSearch = await this.map.mapData(e)
    
  }


  // async onClickSearch() {
  //   this.load = true

  //   const con = {
  //     ModelCode: this.SearchForm.get('ModelCode').value,
  //     ShipDate: this.SearchForm.get('ShipmentDate').value,
  //     CPRno: this.SearchForm.get('CPRno').value,
  //   }
  //   if (this.SearchForm.get('ShipmentDate').invalid) {
  //     delete con.ShipDate
  //   }

  //   if (this.SearchForm.get('ModelCode').invalid) {
  //     delete con.ModelCode
  //   }

  //   if (this.SearchForm.get('CPRno').invalid) {
  //     delete con.CPRno
  //   }
  //   const resultSearchBoxs = await this.searchBoxs(con)
  //   this.ResultSearch = resultSearchBoxs
  //   this.load = false

  // }




  // onClickScan(item) {

  //   if (item._id) {
  //     this.alertSwal.alert('success', 'Success')

  //     localStorage.setItem("BoxId", item._id)
  //     this.route.navigate(['/scan-labels-qrcode'])
      
  //     // location.href = "#/scan-labels-qrcode"
  //   } else {
  //     this.alertSwal.alert('error', 'Please select box')

  //   }
  // }



  // findRequestShipment(box) {
  //   return new Promise((resolve) => {
  //     const temp: any = this.RequestShipmentAll.find((i) => {
  //       if (
  //         i.ShipDate == box.ShipmentDate &&
  //         i.CPRno == box.CPRno
  //       ) {
  //         return i
  //       }

  //     })
  //     resolve(temp)
  //   })
  // }
  // findPatternLabels(shipment) {
  //   return new Promise((resolve) => {
  //     const temp: any = this.PatternAll.find(i => i._id == shipment.PatternLabelId)
  //     resolve(temp)
  //   })
  // }


}
