import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'app/api.service';
import Swal from 'sweetalert2';
import { AlertServiceService } from '../service/alert-service.service';
import { AuthGuardService } from '../service/auth-guard.service';
import { MapDataService } from '../service/map-data.service';

@Component({
  selector: 'app-qrcode-scan',
  templateUrl: './qrcode-scan.component.html',
  styleUrls: ['./qrcode-scan.component.css']
})
export class QrcodeScanComponent implements OnInit {


  // ! session 
  SESSION_BOX_ID = localStorage.getItem('scan-box-id')
  SESSION_MODEL_ID = localStorage.getItem('scan-model-id')


  // 
  MapResult: any

  // ! form control
  SubmitForm = new FormControl('', Validators.required)

  // ! css Control
  scanInputColor: any = 'scanInputColor'

  constructor(
    private api: ApiService,
    private mapService: MapDataService,
    private alertSwal: AlertServiceService,
    private route: Router,
    private auth: AuthGuardService
  ) { }

  ngOnInit(): void {
    this.auth.CheckAuth()
    this.CallAPI()
  }

  async CallAPI() {
    try {
      const box = await this.getBoxByID(this.SESSION_BOX_ID)
      this.MapResult = await this.mapService.mapDataToBoxs(box)

    } catch (error) {

    }
  }

  getBoxByID(BoxID) {
    return new Promise((resolve, reject) => {
      this.api.scanFullSearch(BoxID).subscribe(res => {
        res ? resolve(res) : reject('error')
      })
    })
  }

  async onScan(event: any) {
    const keyCode = event.keyCode
    try {

      await this.checkSpace()
      await this.checkKeyTab(keyCode)
      await this.checkValidValue(this.SubmitForm.value)
      await this.checkCountFully()
      // await this.checkDuplicateSerial(this.SubmitForm.value)
      await this.checkDuplicateInDatabase(this.SubmitForm.value)
      // const scanHistory: any = await this.checkHistoryScan(localStorage.getItem('BoxId'))
      // const patternUse: any = await this.findPatternUse(this.MergeData.PatternLabelId)
      const objReturn: any = await this.splitLabel(this.MapResult.PatternUse.Value, this.SubmitForm.value)
      const setData = {
        ModelInBoxId: this.MapResult.ModelInBoxID,
        Label: this.SubmitForm.value,
        Lot: objReturn.lot,
        Serial: objReturn.serial
      }
      await this.insertScanHistory(setData)
      await this.focusInput()
      this.CallAPI()
      await this.checkCountFullyAfter()
      this.alertSwal.alert('success', 'SUCCESS')
      // this.showNotification('top', 'right', 2, 'insert history scan !!')
      this.SetColor('green', 500)

    } catch (error) {
      if (error == 'CountFullyAfter') {
        this.updateStatus(this.MapResult.BoxID)
        Swal.fire({
          title: 'Scan success is fully !!',
          icon: 'success',
          allowOutsideClick: false
        }).then(async r => {
          if (r.isConfirmed) {
            this.route.navigate(['/scan-labels'])
            // location.href = '#/scan-labels'
          }
        })
      } else {
          Swal.fire({
            title: 'It Wrong !!',
            text: `${error}`,
            icon: 'error',
            allowOutsideClick: false
          }).then(async r => {
            if (r.isConfirmed) {
              this.SubmitForm.reset()
              // await this.focusInput()
            }
          })
          this.SetColor('red', 500)
        }

    }
  }

  checkSpace() {
    return new Promise(((resolve, reject) => {
      if (this.SubmitForm.value) {
        this.SubmitForm.setValue(this.SubmitForm.value.trim())
      }
      resolve(true)
    }))
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

  checkCountFully() {
    return new Promise((resolve, reject) => {
      if (this.MapResult.ScanHistories.length == this.MapResult.ModelQty) {
        reject('CountFully')
      } else {
        resolve(true)
      }
    })
  }

  checkDuplicateSerial(value) {
    return new Promise((resolve, reject) => {
      if (this.MapResult.ScanHistories.length > 0) {
        const histories: any = this.MapResult.ScanHistories
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
  checkDuplicateInDatabase(value) {
    return new Promise((resolve, reject) => {
      this.api.checkDuplicateInDatabase({label:value}).toPromise().then(res=>{
        if(res.data.length == 0){
          resolve(true)
        }else{

          reject('error label duplicate in database')
        }
      }).catch(error=> reject('error checkDuplicateInDatabase'))
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
          if (this.MapResult[pattern.Name]) {
            if (
              this.MapResult[pattern.Name].length == pattern.Digit
            ) {
              wordPrev += this.MapResult[pattern.Name]
            } else {
              reject('Digit incorrect')
            }
          }
          //  todo find name of key
          else {

            if (pattern.Name.toLowerCase().includes('lot')) {
              lot = this.splitLot(wordPrev, index, value, patterns)
              
              if (lot != undefined) {
                if (patterns[index].Digit == lot.length) {
                  wordPrev += lot
                } else {
                  reject('Lot digit incorrect')
                }
              }
            } else
              if (pattern.Name.toLowerCase().includes('serials')) {
                serial = this.splitSerials(wordPrev, index, value, patterns)
                if (serial != undefined && patterns[index].Digit != serial.length) {
                  reject('Serial digit incorrect')
                }
              } else {
                reject('error')
              }
          }
        }

      })

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
      var scan: any = document.getElementById('scanInput')
      this.SubmitForm.reset()
      scan.focus()
      resolve(true)

    }))
  }


  checkCountFullyAfter() {
    return new Promise((resolve, reject) => {

      if (Number(this.MapResult.ScanHistories.length) + 1 == this.MapResult.ModelQty) {
        reject('CountFullyAfter')
      } else {
        resolve(true)
      }
    })
  }


  checkHistoryScan(boxId) {
    return new Promise((resolve, reject) => {
      this.api.checkHistoryByBoxId(boxId).subscribe((res) => {
        resolve(res)
      })
    })
  }
  // findPatternUse(patternBoxId) {
  //   return new Promise(async (resolve, reject) => {
  //     const patternAll: any = await this.getPatternAll()
  //     const patternUse: any = patternAll.find(pattern => pattern._id == patternBoxId)
  //     if (patternUse === undefined) {
  //       reject('not found pattern')
  //     } else {
  //       resolve(patternUse)
  //     }
  //   })
  // }



  splitLot(textNow, indexPattern, value, patterns) {
    const firstSplit = value.split(textNow)[1]
    console.log('textNow',textNow);
    console.log('indexPattern',indexPattern);
    console.log('value',value);
    console.log('patterns',patterns);
    console.log(firstSplit.substring(0, patterns[indexPattern ].Digit) );
    
    let newValue
    if (patterns[indexPattern + 1].Digit == 1) {
      firstSplit ? newValue = firstSplit.split(patterns[indexPattern + 1].Name)[0] : false
    } else {
      firstSplit ? newValue = firstSplit.substring(0, patterns[indexPattern].Digit) : newValue = ''
    }
    return newValue

  }

  splitSerials(textNow, indexPattern, value, patterns) {
    let split2 = value.split(textNow)[1]

    let newValue
    if (patterns.length >= indexPattern + 1) {
      return split2
    } else {
      split2 ? newValue = split2.split(patterns[indexPattern + 1].Name)[0] : false
      return newValue
    }

  }

  updateStatus(BoxId) {
    this.api.searchToCheckStatus(BoxId).toPromise().then(r => {
      const response = r[0]
      const ScanTotal = r[0].scanhistories

      if (ScanTotal.length == response.TotalQty) {
        const temp = {
          Status: 1
        }

        this.api.updateBox(BoxId, temp).toPromise().then(r2 => {
          // this.api.searchCheckStatusShip(this.MapResult.ShipID).toPromise().then(r3 => {
          //   const responseCheckStatusShip = r3[0]
          //   const resultMap = responseCheckStatusShip.boxs.reduce((prev, now) => {
          //     if (now.Status == 0) {
          //       prev = false
          //     }
          //     return prev
          //   }, true)
          //   if (resultMap == true) {
          //     const temp = {
          //       Status: 1
          //     }
          //     this.api.updateRequestShipment(this.MapResult.ShipID, temp).toPromise().then(r4 => {

          //     })
          //   }

          // })
        })
      }
    }).catch(r => {

    })

  }


  // !! func showing return data in html
  LastLabel() {
    const temp = this.MapResult.ScanHistories[this.MapResult.ScanHistories.length - 1]
    return temp ? temp.Label : ''
  }
  LastLot() {
    const temp = this.MapResult.ScanHistories[this.MapResult.ScanHistories.length - 1]
    return temp ? temp.Lot : ''
  }
  LastSerial() {
    const temp = this.MapResult.ScanHistories[this.MapResult.ScanHistories.length - 1]
    return temp ? temp.Serial : ''
  }
  LastTime() {
    const temp = this.MapResult.ScanHistories[this.MapResult.ScanHistories.length - 1]
    return temp ? temp.createdAt : ''
  }


  // !! Control css
  SetColor(color, time) {
    this.scanInputColor = `scanInputColor-${color}`
    setTimeout(() => {
      this.scanInputColor = 'scanInputColor'
    }, time);
  }








}
