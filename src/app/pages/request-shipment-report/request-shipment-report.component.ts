import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from 'app/api.service';
import Swal from 'sweetalert2';
import { AuthGuardService } from '../service/auth-guard.service';
import { GenerateShipmentReportService } from '../service/generate-shipment-report.service';


@Component({
  selector: 'app-request-shipment-report',
  templateUrl: './request-shipment-report.component.html',
  styleUrls: ['./request-shipment-report.component.css']
})
export class RequestShipmentReportComponent implements OnInit {

  constructor(
    private api: ApiService,
    private generateShipment: GenerateShipmentReportService,
    private auth: AuthGuardService
  ) { }

  load = false

  ModelCodeSearch = new FormControl(null)
  ShipMentDateSearch = new FormControl(null)
  CPRnoSearch = new FormControl(null)

  ModelMasterLists: any;
  RequestShipmentLists: any = [];

  LocalStoreStatus = localStorage.getItem('Status')


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



  ngOnInit(): void {
    this.auth.CheckAuth()
  }


  async onSearch() {
    const data = {
      ModelCode: this.ModelCodeSearch.value || '',
      ShipMentDate: this.ShipMentDateSearch.value || '',
      CPRno: this.CPRnoSearch.value || ''
    }
    const result = await this.search(data)
    this.RequestShipmentLists = result

    setTimeout(() => {
      this.load = false
    }, 500);

  }

  search(data: any) {
    this.load = true;

    return new Promise((resolve) => {
      this.api.searchShipmentAndLookup(data).subscribe((data: any) => {
        if (data.length != 0) {
          resolve(data)
        } else {
          this.RequestShipmentLists = []
          setTimeout(() => {
            this.load = false
          }, 500);
          if (this.RequestShipmentLists.length == 0) {
            Swal.fire('No Result', '', 'warning')

          }
        }
      })
    })
  }



  async onClickExportExcelAll() {

    try {
      const data = {
        ModelCode: this.ModelCodeSearch.value || '',
        ShipMentDate: this.ShipMentDateSearch.value || '',
        CPRno: this.CPRnoSearch.value || ''
      }
      this.generateShipment.onGenerateShipment(data)
    } catch (error) {

    }
  }

  onClickExportRowShipment(items) {
    this.generateShipment.exportOnRow(items)

  }









}
