
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'app/api.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scan-labels-qrcode',
  templateUrl: './scan-labels-qrcode.component.html',
  styleUrls: ['./scan-labels-qrcode.component.css']
})
export class ScanLabelsQrcodeComponent implements OnInit {

  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private route: Router
  ) { }
  MergeData: any;
  // ScanHistory: any = [];
  ScanHistoryShow: any = [];
  LastestLot: any
  LastestSerial: any
  SubmitValue = new FormControl(null, Validators.required)
  // Lots: any = []
  // Lot: any;
  QrCodes: any = []


  // Serials: any = [];


  public get LastScaner(): string {
    const index: any = this.ScanHistoryShow.length - 1
    return this.ScanHistoryShow[0]
  }


  async ngOnInit(): Promise<void> {
    try {
      const session_boxId = localStorage.getItem('BoxId');
      this.MergeData = await this.getBoxsById(session_boxId)
      this.ScanHistoryShow = this.MergeData.history

      if (this.MergeData.history.length > 0) {
        // run func have history
        this.MergeData.history = this.MergeData.history.reverse()
        const result_split: any = await this.splitLabel(this.MergeData.pattern[0].Value, this.MergeData.history[0].Label)
        this.LastestLot = result_split.lot
        this.LastestSerial = result_split.serial
        await this.checkCountFully()
      }

    } catch (error) {
      (error);
      if (error == "CountFully") {
        this.swalCountFully()
      } else {
        Swal.fire({
          title: 'Some thing wrong !!',
          icon: 'error',
          text: `${error}`,
          allowOutsideClick: false
        })
      }

    }

  }


  getBoxsById(id) {
    return new Promise((resolve) => {
      this.api.getBoxsById(id).subscribe((data: any) => {
        resolve(data[0])
      })
    })
  }

  setPatternName(sourceData) {
    return new Promise(resolve => {
      this.api.getPattern().subscribe(res => {
        const temp: any = res.find(r => r._id == sourceData.PatternLabelId)
        //                                           (temp);
        sourceData['PatternName'] = temp.PatternName
        resolve(sourceData)
      })
    })
  }
  getShipmentByCondition(box) {
    const body = {
      ModelCode: box.ModelCode,
      CPRno: box.CPRno,
      ShipDate: box.ShipmentDate
    }
    return new Promise((resolve) => {
      this.api.searchRequestShipment(body).subscribe((data: any) => {
        resolve(data[0])
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
  getHistoryByIdBox(boxId: string) {
    return new Promise(resolve => {
      this.api.checkHistoryByBoxId(boxId).subscribe((response: any) => {
        resolve(response)
      })
    })
  }



  async onSubmit(event: any) {
    // const keyCode = event.keyCode

    try {
      await this.checkKeyTab(event.keyCode)
      await this.checkValidValue(this.SubmitValue.value)
      await this.checkCountFully()
      await this.checkDuplicateSerial(this.SubmitValue.value)
      // const scanHistory: any = await this.checkHistoryScan(localStorage.getItem('BoxId'))
      // const patternUse: any = await this.findPatternUse(this.MergeData.PatternLabelId)
      const objReturn: any = await this.splitLabel(this.MergeData.pattern[0].Value, this.SubmitValue.value)
      const setData = {
        BoxId: this.MergeData._id,
        ShipmentId: this.MergeData.ShipmentId,
        Label: this.SubmitValue.value,
        Lot: objReturn.lot,
        Serial: objReturn.serial
      }
      await this.insertScanHistory(setData)
      await this.ngOnInit()
      await this.focusInput()
      this.showNotification('top', 'right', 2, 'insert history scan !!')

    } catch (error) {
      (error);

      Swal.fire({
        title: 'It Wrong !!',
        text: `${error}`,
        icon: 'error',
        allowOutsideClick: false
      }).then(async r => {
        if (r.isConfirmed) {
          await this.focusInput()
        }
      })




    }
  }

  checkKeyTab(keyCode) {
    const state = new Promise(((resolve, reject) => {
      keyCode === 9 ? resolve(true) : false
    }))
    return state
  }

  checkValidValue(value) {
    return new Promise((resolve, reject) => {
      value ? resolve(true) : reject('no value')
    })
  }

  checkHistoryScan(boxId) {
    return new Promise((resolve, reject) => {
      this.api.checkHistoryByBoxId(boxId).subscribe((res) => {
        resolve(res)
      })
    })
  }
  findPatternUse(patternBoxId) {
    return new Promise(async (resolve, reject) => {
      const patternAll: any = await this.getPatternAll()
      const patternUse: any = patternAll.find(pattern => pattern._id == patternBoxId)
      if (patternUse === undefined) {
        reject('not found pattern')
      } else {
        resolve(patternUse)
      }
    })
  }

  splitLabel(patterns, value) {
    return new Promise((resolve, reject) => {
      let wordPrev: string = ""
      let lot: string = ""
      let serial: string = ""
      patterns.map((pattern, index) => {
        if (pattern.Digit === 1) {
          wordPrev += pattern.Name
        } else {
          // todo  check key of object mergeData if have follow pattern Name
          if (this.MergeData[pattern.Name]) {
            if (this.MergeData[pattern.Name].length == pattern.Digit) {
              wordPrev += this.MergeData[pattern.Name]
            } else {
              reject('Digit incorrect')
            }
          }
          //  todo find name of key
          else {

            if (pattern.Name.toLowerCase().includes('lot')) {
              lot = this.splitLot(wordPrev, index, value, patterns)
              //                                           (lot);
              if (lot) {
                if (patterns[index].Digit == lot.length) {
                  wordPrev += lot
                } else {
                  reject('Lot digit incorrect')
                }
              }
            } else
              if (pattern.Name.toLowerCase().includes('serials')) {
                serial = this.splitSerials(wordPrev, index, value, patterns)
                if (patterns[index].Digit != serial.length) {
                  reject('Serial digit incorrect')
                }
              }
          }
        }
      })

      //                                           (lot,serial);
      if (lot && serial) {
        const temp = {
          lot: lot,
          serial: serial
        }

        resolve(temp)
      } else {
        reject('split pattern error')
      }

    })
  }


  splitLot(textNow, indexPattern, value, patterns) {
    const split2 = value.split(textNow)[1]
    //                                           (split2);

    let newValue
    split2 ? newValue = split2.split(patterns[indexPattern + 1].Name)[0] : false
    return newValue

  }

  splitSerials(textNow, indexPattern, value, patterns) {
    let split2 = value.split(textNow)[1]
    //                                           (split2);

    let newValue
    if (patterns.length >= indexPattern + 1) {
      return split2
    } else {
      split2 ? newValue = split2.split(patterns[indexPattern + 1].Name)[0] : false
      return newValue
    }

  }

  checkDuplicateSerial(value) {
    return new Promise((resolve, reject) => {
      if (this.MergeData.history.length > 0) {
        const histories: any = this.MergeData.history
        const temp = histories.find(history => history.Label == value)
        if (temp == undefined) {
          resolve(true)
        } else {
          reject('label is duplicate')
        }
      } else {
        resolve(true)
      }
    })
  }

  checkCountFully() {
    return new Promise((resolve, reject) => {
      if (this.ScanHistoryShow.length == this.MergeData.Qty) {
        reject('CountFully')
      } else {
        resolve(true)
      }
    })
  }

  insertScanHistory(body) {
    return new Promise((resolve, reject) => {
      this.api.insertHistory(body).subscribe((res => {
        if (res.length > 0) {
          resolve(true)
        } else {
          reject('insert scan history error')
        }
      }))
    })
  }

  focusInput() {
    return new Promise((resolve => {
      var scan: any = document.getElementById('scan')
      this.SubmitValue.reset()
      scan.focus()
      resolve(true)
    }))
  }





  onClickDeleteHistoriesAll() {
    Swal.fire({
      title: 'Do you want to delete all history?',
      icon: 'question',
      showCancelButton: true
    }).then(async r => {
      if (r.isConfirmed) {
        try {
          await this.deleteHistoryAll(this.MergeData._id)
          this.ngOnInit()
          this.showNotification('top', 'right', 2, 'histories deleted !!')

        } catch (error) {
          Swal.fire({
            title: 'It Wrong',
            icon: 'error',
            text: `${error}`
          })
        }
      }
    })
  }

  deleteHistoryAll(boxId: any) {
    return new Promise((resolve, reject) => {
      this.api.deleteHistoryAllByBoxId(boxId).subscribe((res => {
        if (res.deletedCount > 0) {
          resolve(true)
        } else {
          reject(`Can't delete histories`)
        }
      }))
    })
  }
  deleteHistory(boxId: any) {
    return new Promise((resolve, reject) => {
      this.api.deleteHistory(boxId).subscribe((res => {
        if (res.deletedCount > 0) {
          resolve(true)
        } else {
          reject(`Can't delete history`)
        }
      }))
    })
  }



  onClickDeleteHistory(history: any) {
    Swal.fire({
      title: `Do you want to delete  ?`,
      text: `${history.Label}`,
      icon: 'question',
      showCancelButton: true
    }).then(async r => {
      if (r.isConfirmed) {
        try {
          await this.deleteHistory(history._id)
          this.ngOnInit()
          this.showNotification('top', 'right', 2, 'deleted !!')
        } catch (error) {
          Swal.fire({
            title: 'It Wrong',
            icon: 'error',
            text: `${error}`
          })
        }
      }
    })
  }

  updateBox() {
    return new Promise((resolve, reject) => {
      const body = {
        Status: 1
      }
      this.api.updateBox(this.MergeData._id, body).subscribe((res => {
        if (res.modifiedCount > 0) {
          resolve(true)
        } else {
          reject('update status box error')
        }
      }))
    })
  }


  swalCountFully() {
    Swal.fire({
      title: 'Success fully',
      icon: 'success',
      allowOutsideClick: false
    }).then(async r => {
      if (r.isConfirmed) {
        try {
          await this.updateBox()
          this.route.navigate(['/scan-labels'])
          // location.href = "#/scan-labels"
        } catch (error) {
          Swal.fire({
            title: 'It Wrong !!',
            text: `${error}`,
            icon: 'error',
            allowOutsideClick: false
          })
        }
      }
    })
  }




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
