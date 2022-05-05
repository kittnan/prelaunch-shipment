import { Injectable } from '@angular/core';
import { Cell, Row, Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver'

import * as QRCode from 'qrcode'
@Injectable({
  providedIn: 'root'
})



export class LabelExportService {

  constructor() { }


  async exportLabel(rawData) {

    if (rawData.boxs.length > 1 || rawData.boxs.Models.length > 1) {
      // todo label 1 model
      this.onGenLabelOneModel(rawData)
    } else {
      // todo label multi model
      this.onGenLabelMultiLabel()
    }



  }


  async onGenLabelOneModel(rawData) {
    // await this.buildData(rawData)
    this.makeExcelReport(rawData)
  }

  onGenLabelMultiLabel() {

  }


  buildData(rawData) {
    return new Promise((resolve, reject) => {
      let temp = []
      const LabelData = {
        shipmentPlace: '',
        shipmentTo: '',
        partName: '',
        boxNo: '',
        Qty: ''
      }
      LabelData.shipmentPlace = rawData.ShipPlace
      LabelData.shipmentTo = rawData.ShipTo
      LabelData.partName = rawData.PartName

      // rawData.boxs.forEach((box, index) => {
      //   LabelData.boxNo = box.Name
      //   LabelData.Qty = box.Qty
      //   temp.push(LabelData)
      // });


      // if (temp.length > 0) {
      //   resolve(temp)
      // } else {
      //   reject('error build Data')
      // }


    })
  }

  async makeExcelReport(data) {

    // todo create workbook and add worksheet
    let workbook = new Workbook;
    let worksheet = workbook.addWorksheet('sheetName')
    // worksheet.pageSetup.paperSize = 11
    const widthCell = 10
    const widthCellBorder = 1
    worksheet.columns = [
      { width: widthCellBorder }, // 1
      { width: widthCell }, // 2
      { width: widthCellBorder }, // 3
      { width: widthCell }, // 4
      { width: widthCell }, // 5
      { width: widthCell }, // 6
      { width: widthCell }, // 7
      { width: widthCellBorder }, // 8
      { width: widthCellBorder }, // 9
      { width: widthCell }, // 10
      { width: widthCellBorder }, // 11
    ];
    // worksheet.pageSetup.printArea = 'A1:J20'


    // todo Add Row and formatting
    const tempMockCell = [
      ['r1', '', '', '', '', '', '', '', '', '', ''],
      ['r2', '', '', '', '', '', '', '', '', '', ''],
      ['r3', 'from', '', 'logo', '', '', '', '', '', 'qrcode', ''],
      ['r4', '', '', '', '', '', '', '', '', '', ''],
      ['r5', 'to', '', 'shipplace', '', '', '', '', '', '', ''],
      ['r6', '', '', 'shipto', '', '', '', '', '', '', ''],
      ['r7', 'boxNo', '', 'partName', '', '', 'qty', '', '', 'review', ''],
      ['r8', '11111', '', 'asdasdas', '', '', '100', '', '', 'approve', ''],
      ['', '', '', '', '', '', '', '', '', '', ''],
    ]
    const mockCells = [tempMockCell, tempMockCell]


    await this.ontest(worksheet, mockCells)
    this.createWorkBook(workbook, worksheet)



    // data.forEach(async (box, indexBox) => {
    //                                             ('box', box);

    //   // const text = `${box.boxNo}*${box.partName}*${box.Qty}`
    //   // const temp_qrCodeBase64: any = await this.genQrCodeToBase64(text)
    //   // const qrCodeBase64: any = temp_qrCodeBase64.toString()
    //   //                                           (qrCodeBase64);




  }
  ontest(worksheet: Worksheet, mockCells) {
    return new Promise((resolve, reject) => {
      const a = mockCells.map(async mockCell => {

        await this.addMockCellToSheet(mockCell, worksheet)
        // this.onResizeCell(worksheet)
        this.onMergeCell(worksheet)
      });
      a ? resolve(a) : reject('weq')
    })
  }

  addMockCellToSheet(mockCell, worksheet) {
    return new Promise((resolve, reject) => {
      mockCell.map(cell => {
        worksheet.addRow([...cell])
      })
      resolve(true)
    })
  }
  onMergeCell(worksheet: Worksheet) {
    // return new Promise((resolve, reject) => {
    worksheet.eachRow((row: Row, rowNumber: number) => {

      row.eachCell((cell: Cell, colNumber: number) => {
        //                                           (cell.value);

        // if (cell.value == 'r1' || cell.value == 'r2' || cell.value == 'r4') {
        //   row.height = 10
        //   cell.value = ''
        // } else
        //   if (cell.value == 'r3') {
        //     row.height = 60
        //     cell.value = ''
        //   } else
        //     if (cell.value == 'r5' || cell.value == 'r6' || cell.value == 'r7' || cell.value == 'r8') {
        //       row.height = 30
        //       cell.value = ''
        //     }


        if (cell.value == 'from') {
          worksheet.mergeCells({
            top: rowNumber-1,
            left: colNumber,
            bottom: rowNumber + 1,
            right: colNumber
          })
          cell.value = "FROM"
        }
        if (cell.value == 'logo') {
          worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber + 3)
          cell.value = "LOGO"
        }
        if (cell.value == 'to') {
          worksheet.mergeCells(rowNumber, colNumber, rowNumber+1, colNumber )
          cell.value = "TO:"
        }
        if (cell.value == 'shipplace') {
          worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber+7 )
          cell.value = "SHIP PLACE:"
        }
        if (cell.value == 'shipto') {
          worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber+7 )
          cell.value = "SHIP TO:"
        }
        if (cell.value == 'partName') {
          worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber+2 )
          cell.value = "PART NAME"
        }
        if (cell.value == 'qty') {
          worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber+1 )
          cell.value = "qty"
        }
        if (cell.value == 'review') {
          worksheet.mergeCells(rowNumber, colNumber-1, rowNumber, colNumber+1 )
          cell.value = "review"
        }
        if (cell.value == 'approve') {
          worksheet.mergeCells(rowNumber, colNumber-1, rowNumber, colNumber+1 )
          cell.value = "approve"
        }
      

      })
      // return row
    })
    //   resolve(r)
    // })
  }
  onResizeCell(workSheet: Worksheet) {
    return new Promise((resolve, reject) => {
      workSheet.eachRow((row, numrow) => {



        if (numrow === 3) {
          row.height = 20
          row.eachCell((cell: Cell, numCol: number) => {
            if (
              numCol === 2 ||
              numCol === 4 ||
              numCol === 5 ||
              numCol === 6 ||
              numCol === 7 ||
              numCol === 10
            ) {
              const dobCol = workSheet.getColumn(numCol);
              dobCol.width = 17
            }
          })
        }


      })
      resolve(true)
    })
  }

  async createWorkBook(workbook, worksheet) {
    // await worksheet.protect('1234', {});
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let title = new Date().getTime()
      fs.saveAs(blob, title + '-label.xlsx');
    })
  }



  generateLabel(data) {

  }

  genQrCodeToBase64(text: any) {
    return new Promise((resolve, reject) => {
      const qrCodeBase64: string = QRCode.toDataURL(text)
      qrCodeBase64 ? resolve(qrCodeBase64) : reject('error genQrCodeToBase64')
    })
  }

}
