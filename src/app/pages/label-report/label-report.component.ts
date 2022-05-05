import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthGuardService } from '../service/auth-guard.service';
import { MapDataService } from '../service/map-data.service';

@Component({
  selector: 'app-label-report',
  templateUrl: './label-report.component.html',
  styleUrls: ['./label-report.component.css']
})
export class LabelReportComponent implements OnInit {

  load :boolean= false
  constructor(
    private map: MapDataService,
    private auth: AuthGuardService,

  ) { }
  SearchForm = new FormGroup({
    ShipmentDate: new FormControl(null, Validators.required),
    CPRno: new FormControl(null, Validators.required),
    ModelCode: new FormControl(null, Validators.required)
  })


  // ModelMasterAll: any
  // ResultSearch: any

  ResultSearch: any




  async ngOnInit(): Promise<void> {
    this.load = true
    this.auth.CheckAuth()
    this.load = false
  }


  async onSearch(e) {
    try {
      this.ResultSearch = await this.map.mapData(e)
      
    } catch (error) {
      alert(error)
    }

  }


}
