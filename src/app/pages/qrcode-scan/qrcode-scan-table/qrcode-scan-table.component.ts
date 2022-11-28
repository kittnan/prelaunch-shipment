import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'app/api.service';
import { AlertServiceService } from 'app/pages/service/alert-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-qrcode-scan-table',
  templateUrl: './qrcode-scan-table.component.html',
  styleUrls: ['./qrcode-scan-table.component.css']
})
export class QrcodeScanTableComponent implements OnInit {


  @Input() data: any
  @Output() DeleteHistory = new EventEmitter<string>()
  @Input() edit = true;
  constructor(
    private api: ApiService,
    private alertSwal: AlertServiceService
  ) { }

  ngOnInit(): void {
  }

  onClickDeleteHistory(item) {

    Swal.fire({
      title: 'Do you have delete ?',
      icon: 'question',
      showCancelButton: true,
      text: `${item.Label}`
    }).then(async r => {
      if (r.isConfirmed) {
        try {
          await this.onDeleteHistory(item._id)
          this.alertSwal.alert('success', 'Delete success!')
          this.DeleteHistory.emit()
        } catch (error) {

        }
      }
    })
  }
  onDeleteHistory(historyID) {
    return new Promise((resolve, reject) => {
      this.api.deleteHistory(historyID).toPromise().then(r => {
        resolve(true)
      }).catch(error => {
        reject(error)
      })
    })
  }

  onClickClearAll(items) {
    Swal.fire({
      title: 'Do you have delete all history ?',
      icon: 'question',
      showCancelButton: true
    }).then(async r => {
      if (r.isConfirmed) {
        try {
          const resultMapID: any = await this.onMapID(items)
          await this.deleteMultiRow(resultMapID)
          this.alertSwal.alert('success', `Deleted ${resultMapID.length} histories !`)
          this.DeleteHistory.emit()
        } catch (error) {
          this.alertSwal.alert('error', error)
        }
      }
    })





  }
  onMapID(items) {
    return new Promise((resolve, reject) => {
      const mapID = items.map(item => {
        return item._id
      })
      mapID ? resolve(mapID) : reject('error map')
    })
  }
  deleteMultiRow(resultMapID) {
    return new Promise((resolve, reject) => {
      this.api.deleteMultiRow({ mapID: resultMapID }).toPromise().then(r => {
        if (r.deletedCount == resultMapID.length) {
          resolve(true)
        }
        reject('error')
      })
    })
  }

}
