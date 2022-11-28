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
    this.auth.CheckAuth()
    this.RequestShipmentAll = await this.getRequestShipment()
    this.ModelMasterAll = await this.getModelMaster();
    this.PatternAll = await this.getPatternAll();
  }



  getRequestShipment() {
    return new Promise((resolve) => {
      this.api.getRequestShipment().subscribe((data: any) => {
        resolve(data)
      })
    })
  }

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








  clickEmit(e:any){
    this.load = e
  }
  async onSearch(e:any) {
    try {
      this.load = true
      this.ResultSearch = await this.map.mapData(e)
    } catch (error) {
      alert(error)
    }finally{
      setTimeout(() => {
        this.load = false
      }, 500);
    }

  }



}
