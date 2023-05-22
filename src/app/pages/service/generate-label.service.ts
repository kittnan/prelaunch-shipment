import { Injectable } from '@angular/core';
import { Cell, Row, Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver'
import * as logo from './logo.js'
import * as QRCode from 'qrcode'
import { WorkSheet } from 'xlsx';
import { ProtectSheetService } from './protect-sheet.service.js';

@Injectable({
  providedIn: 'root'
})
export class GenerateLabelService {

  Logo: any
  QrCode: any

  ProtectSheetLabel: any
  constructor(
    private protectSheet: ProtectSheetService
  ) { }


  async exportLabel(rawData) {
    //                                           (rawData.ModelInBox.length);
    const resultProtectSheet: any = await this.protectSheet.ProtectSheet()
    this.ProtectSheetLabel = resultProtectSheet.find(m => m.Name == 'Password-Label')

    if (rawData.ModelInBox.length === 1) {
      this.onOneModel(rawData)
    } else {
      this.onMultiModel(rawData)
    }
  }


  // ! export one model in box ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
  async onOneModel(rawData) {
    try {
      const qrCodeBase64 = await this.genQrCodeBase64(rawData)
      rawData['qrCode'] = qrCodeBase64
      this.makeExcelReport(rawData)
    } catch (error) {
      (error)
    }
  }

  async makeExcelReport(data) {

    try {
      // todo create workbook and add worksheet
      let workbook = new Workbook;
      let worksheet = workbook.addWorksheet('sheetName')
      this.setPageSetupOnOneModel(worksheet)
      const mockCells = this.setMockUpDataLayout()

      // ! add image to workbook by base64
      this.QrCode = workbook.addImage({
        base64: data.qrCode,
        extension: 'png',
      });
      this.Logo = workbook.addImage({
        base64: logo.logoBase64,
        extension: 'png',
      });

      await this.setLayoutOnOneModel(worksheet, mockCells, data)
      this.createWorkBookOnOneModel(workbook, worksheet, data)

    } catch (error) {
      console.log(error);


    }


  }

  genQrCodeBase64(rawData) {
    return new Promise((resolve, reject) => {
      const text: string = `${rawData.BoxName}*${rawData.ModelInBox[0].PartName}*${rawData.ModelInBox[0].Qty}`
      const qrCodeBase64: string = QRCode.toDataURL(text)
      qrCodeBase64 ? resolve(qrCodeBase64) : reject('error genQrCodeBase64')
    })
  }
  setPageSetupOnOneModel(worksheet: Worksheet) {
    worksheet.pageSetup = {
      paperSize: 11,
      margins: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        header: 0,
        footer: 0
      }
    }
    const widthCell = 10.5
    const widthCellBorder = 0.5
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

  }
  setMockUpDataLayout() {
    // todo Add Row and formatting
    const tempMockCell = [
      ['r1', '', '', '', '', '', '', '', '', '', ''],
      ['r2', '', 'logo-l', 'logo-t', '', '', '', 'logo-r', 'qrcode-l', 'qrcode-t', 'qrcode-r'],
      ['r3', 'from', '', 'logo', '', '', '', '', '', 'qrcode', ''],
      ['r4', '', '', 'logo-b', '', '', '', '', '', 'qrcode-b', ''],
      ['r5', 'to', '', 'shipplace', '', '', '', '', '', '', ''],
      ['r6', '', '', 'shipto', '', '', '', '', '', '', ''],
      ['r7', 'boxNo', '', 'partName', '', '', 'qty', '', '', 'review', ''],
      ['r8', 'boxNoValue', '', 'partNameValue', '', '', 'qtyValue', '', '', 'approve', ''],
      ['', '', '', '', '', '', '', '', '', '', ''],
    ]
    const temp = [tempMockCell, tempMockCell]
    return temp
  }
  setLayoutOnOneModel(worksheet: Worksheet, mockCells, data) {
    return new Promise((resolve, reject) => {
      const resultSetLayout = mockCells.map(async mockCell => {
        // ! add mock layout
        await this.addMockCellToSheet(mockCell, worksheet)
        // ! insert data , merge, style
        this.onMergeCellOneModel(worksheet, data)
        return mockCell
      });
      resultSetLayout ? resolve(resultSetLayout) : reject('error set layout')
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
  onMergeCellOneModel(worksheet: Worksheet, data) {
    return new Promise((resolve, reject) => {
      worksheet.eachRow((row: Row, rowNumber: number) => {

        row.eachCell((cell: Cell, colNumber: number) => {

          if (cell.value == 'r1' || cell.value == 'r2' || cell.value == 'r4') {
            row.height = 1
            cell.value = ''
          } else
            if (cell.value == 'r3') {
              row.height = 50
              cell.value = ''
            } else
              if (cell.value == 'r5') {
                row.height = 50
                cell.value = ''
              }
              else
                if (cell.value == 'r6' || cell.value == 'r7' || cell.value == 'r8') {
                  row.height = 30
                  cell.value = ''
                }


          if (cell.value == 'from') {
            worksheet.mergeCells(rowNumber - 1, colNumber, rowNumber + 1, colNumber)
            cell.value = "From"
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'left'
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'gray0625',
            }
            cell.font = {
              bold: true,
              size: 16
            }

          }

          // * logo
          if (cell.value == 'logo') {
            // worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber + 3)
            cell.value = ""
            worksheet.addImage(this.Logo, `D${rowNumber}:G${rowNumber}`);
          }
          // * logo -> border
          if (cell.value == 'logo-t') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber + 3)
            cell.value = ""
            this.setBorder(cell, 'top')
          }
          if (cell.value == 'logo-l') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber + 2, colNumber)
            cell.value = ""
            this.setBorder(cell, 'tlb')

          }
          if (cell.value == 'logo-b') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber + 3)
            cell.value = ""
            this.setBorder(cell, 'bottom')
          }
          if (cell.value == 'logo-r') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber + 2, colNumber)
            cell.value = ""
            this.setBorder(cell, 'trb')
          }


          // * Qr Code
          if (cell.value == 'qrcode') {
            cell.value = ""
            worksheet.addImage(this.QrCode, `J${rowNumber}:J${rowNumber}`);

          }
          // * Qr Code -> border
          if (cell.value == 'qrcode-l') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber + 2, colNumber)
            cell.value = ""
            this.setBorder(cell, 'tlb')
          }
          if (cell.value == 'qrcode-r') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber + 2, colNumber)
            cell.value = ""
            this.setBorder(cell, 'trb')
          }
          if (cell.value == 'qrcode-t') {
            cell.value = ""
            this.setBorder(cell, 'top')
          }
          if (cell.value == 'qrcode-b') {
            cell.value = ""
            this.setBorder(cell, 'bottom')
          }


          if (cell.value == 'to') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber + 1, colNumber)
            cell.value = "To:"
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'gray0625',
            }
            cell.font = {
              bold: true,
              size: 16
            }
          }


          if (cell.value == 'shipplace') {
            worksheet.mergeCells(rowNumber, colNumber - 1, rowNumber, colNumber + 7)
            cell.value = data.ShipPlace
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center',
              wrapText: true
            }

          }


          if (cell.value == 'shipto') {
            worksheet.mergeCells(rowNumber, colNumber - 1, rowNumber, colNumber + 7)
            cell.value = data.ShipTo
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }

          }


          if (cell.value == 'boxNo') {
            cell.value = "Box no."
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'gray0625',
            }
            cell.font = {
              bold: true
            }
          }
          if (cell.value == 'boxNoValue') {
            cell.value = data.BoxName
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }

          }


          if (cell.value == 'partName') {
            worksheet.mergeCells(rowNumber, colNumber - 1, rowNumber, colNumber + 2)
            cell.value = "Part name"
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'gray0625',
            }
            cell.font = {
              bold: true
            }
          }
          if (cell.value == 'partNameValue') {
            worksheet.mergeCells(rowNumber, colNumber - 1, rowNumber, colNumber + 2)
            cell.value = data.ModelInBox[0].PartName
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }


          }


          if (cell.value == 'qty') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber + 1)
            cell.value = "Q'ty(pcs.)"
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'gray0625',
            }
            cell.font = {
              bold: true,
            }
          }
          if (cell.value == 'qtyValue') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber + 1)
            cell.value = data.ModelInBox[0].Qty
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }

          }


          if (cell.value == 'review') {
            worksheet.mergeCells(rowNumber, colNumber - 1, rowNumber, colNumber + 1)
            cell.value = "Review"
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'top', horizontal: 'left'
            }
            cell.font = {
              size: 10
            }

          }
          if (cell.value == 'approve') {
            worksheet.mergeCells(rowNumber, colNumber - 1, rowNumber, colNumber + 1)
            cell.value = "Approve"
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'top', horizontal: 'left'
            }
            cell.font = {
              size: 10
            }
          }


        })
        // return row
      })
      resolve(true)
    })
  }
  async createWorkBookOnOneModel(workbook, worksheet, rawData) {
    await worksheet.protect(this.ProtectSheetLabel.Password, {});
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let title = `${rawData.CPRno}-${this.setFormatDateShipment(rawData.ShipDate)}-Boxno${rawData.BoxName}`
      fs.saveAs(blob, title);


    })
  }
  setFormatDateShipment(ShipDate) {
    let d = new Date(ShipDate);
    let ye = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    let sumDate = (`${da}-${mo}-${ye}`);
    return sumDate
  }

  // ! export one model in box <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-.


  // ! export multi model in box ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
  async onMultiModel(rawData) {

    try {
      // todo create workbook and add worksheet
      let workbook = new Workbook;
      let worksheet = workbook.addWorksheet('sheetName')
      this.setPageSetUpOnMultiModel(worksheet)
      const mockCells = this.setMockUpDataLayoutOnMultiModel(rawData)
      this.Logo = workbook.addImage({
        base64: logo.logoBase64,
        extension: 'png',
      });
      await this.setLayoutOnMultiModel(worksheet, mockCells, rawData)
      this.createWorkBookOnMultiModel(workbook, worksheet, rawData)

    } catch (error) {

    }
  }

  setPageSetUpOnMultiModel(worksheet: WorkSheet) {
    worksheet.pageSetup = {
      paperSize: 11,
      margins: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        header: 0,
        footer: 0
      }
    }
    const widthCell = 10.5
    const widthCellBorder = 0.5
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
  }
  setMockUpDataLayoutOnMultiModel(rawData) {
    // todo Add Row and formatting
    let tempMockCell = [
      ['r1', '', '', '', '', '', '', '', '', '', ''],
      ['r2', '', 'logo-l', 'logo-t', '', '', '', '', '', '', 'logo-r'],
      ['r3', 'from', '', 'logo', '', '', '', '', '', '', ''],
      ['r4', '', '', 'logo-b', '', '', '', '', '', '', ''],
      ['r', 'to', '', 'shipplace', '', '', '', '', '', '', ''],
      ['r', '', '', 'shipto', '', '', '', '', '', 'review', ''],
      ['r', 'boxNo', '', 'partName', '', '', 'qty', '', '', 'approve', ''],
      // ['r', 'boxNoValue', '', 'partNameValue', '', '', 'qtyValue', '', '', 'qrCode', ''],

    ]
    rawData.ModelInBox.map((model, indexModel) => {
      tempMockCell.push(
        ['r', `boxNoValue/${indexModel}`, '', `partNameValue/${indexModel}`, '', '', `qtyValue/${indexModel}`, '', '', 'qrCode', '']
      )
      return model
    })
    tempMockCell.push(['', '', '', '', '', '', '', '', '', '', ''],)

    const temp = [tempMockCell, tempMockCell]
    return temp
  }

  setLayoutOnMultiModel(worksheet: Worksheet, mockCells, data) {
    return new Promise((resolve, reject) => {
      const resultMapMockCell = mockCells.map(async mockCell => {
        // ! add mock layout
        await this.addMockCellToSheet(mockCell, worksheet)
        // ! insert data , merge, style
        this.onMergeCellMultiModel(worksheet, data)
      })
      resultMapMockCell ? resolve(resultMapMockCell) : reject('error setLayoutOnMultiModel')
    })
  }

  onMergeCellMultiModel(worksheet: Worksheet, data) {
    return new Promise((resolve, reject) => {

      worksheet.eachRow((row: Row, rowNumber: number) => {
        row.eachCell((cell: Cell, colNumber: number) => {

          if (cell.value == 'r1' || cell.value == 'r2' || cell.value == 'r4') {
            row.height = 1
            cell.value = ''
          } else
            if (cell.value == 'r3') {
              row.height = 50
              cell.value = ''
            } else
              if (cell.value == 'r') {
                row.height = 30
                cell.value = ''
              }


          if (cell.value == 'from') {
            worksheet.mergeCells(rowNumber - 1, colNumber, rowNumber + 1, colNumber)
            cell.value = "From"
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'left'
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'gray0625',
            }
            cell.font = {
              bold: true,
              size: 16
            }

          }

          // * logo
          if (cell.value == 'logo') {
            // worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber + 3)
            cell.value = ""
            worksheet.addImage(this.Logo, `D${rowNumber}:J${rowNumber}`);
          }
          // * logo -> border
          if (cell.value == 'logo-t') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber + 6)
            cell.value = ""
            this.setBorder(cell, 'top')
          }
          if (cell.value == 'logo-l') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber + 2, colNumber)
            cell.value = ""
            this.setBorder(cell, 'tlb')

          }
          if (cell.value == 'logo-b') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber + 6)
            cell.value = ""
            this.setBorder(cell, 'bottom')
          }
          if (cell.value == 'logo-r') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber + 2, colNumber)
            cell.value = ""
            this.setBorder(cell, 'trb')
          }

          if (cell.value == 'to') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber + 1, colNumber)
            cell.value = "To:"
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'gray0625',
            }
            cell.font = {
              bold: true,
              size: 16
            }
          }


          if (cell.value == 'shipplace') {
            worksheet.mergeCells(rowNumber, colNumber - 1, rowNumber, colNumber + 7)
            cell.value = data.ShipPlace
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center',
              wrapText: true
            }

          }


          if (cell.value == 'shipto') {
            worksheet.mergeCells(rowNumber, colNumber - 1, rowNumber, colNumber + 4)
            cell.value = data.ShipTo
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }

          }


          if (cell.value == 'boxNo') {
            cell.value = "Box no."
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'gray0625',
            }
            cell.font = {
              bold: true
            }
          }
          const cellValue = cell.value.toString()
          if (cellValue.includes('boxNoValue')) {
            const indexModel = Number(cellValue.split('/')[1])
            cell.value = `${data.BoxName}.${indexModel + 1}`
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }

          }


          if (cell.value == 'partName') {
            worksheet.mergeCells(rowNumber, colNumber - 1, rowNumber, colNumber + 2)
            cell.value = "Part name"
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'gray0625',
            }
            cell.font = {
              bold: true
            }
          }
          if (cellValue.includes('partNameValue')) {
            worksheet.mergeCells(rowNumber, colNumber - 1, rowNumber, colNumber + 2)
            const indexModel = Number(cellValue.split('/')[1])
            cell.value = `${data.ModelInBox[indexModel].PartName}`
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }


          }


          if (cell.value == 'qty') {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber + 1)
            cell.value = "Q'ty(pcs.)"
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'gray0625',
            }
            cell.font = {
              bold: true,
            }
          }
          if (cellValue.includes('qtyValue')) {
            worksheet.mergeCells(rowNumber, colNumber, rowNumber, colNumber + 1)
            const indexModel = Number(cellValue.split('/')[1])
            cell.value = `${data.ModelInBox[indexModel].Qty}`
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'middle', horizontal: 'center'
            }

          }

          if (cell.value == 'qrCode') {
            worksheet.mergeCells(rowNumber, colNumber - 1, rowNumber, colNumber + 1)
            cell.value = ''
            this.setBorder(cell, '')
          }


          if (cell.value == 'review') {
            worksheet.mergeCells(rowNumber, colNumber - 1, rowNumber, colNumber + 1)
            cell.value = "Review"
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'top', horizontal: 'left'
            }
            cell.font = {
              size: 10
            }

          }
          if (cell.value == 'approve') {
            worksheet.mergeCells(rowNumber, colNumber - 1, rowNumber, colNumber + 1)
            cell.value = "Approve"
            this.setBorder(cell, '')
            cell.alignment = {
              vertical: 'top', horizontal: 'left'
            }
            cell.font = {
              size: 10
            }
          }


        })
      })
      resolve(true)
    })
  }

  async createWorkBookOnMultiModel(workbook, worksheet: WorkSheet, rawData) {
    await worksheet.protect(this.ProtectSheetLabel.Password, {});
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let title = `${rawData.CPRno}-${this.setFormatDateShipment(rawData.ShipDate)}-Boxno${rawData.BoxName}`

      // let title = `label-box-${new Date().toLocaleDateString()}`
      fs.saveAs(blob, title);
    })
  }


  // ! export multi model in box <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-.




  setBorder(cell: Cell, key: string) {
    switch (key) {
      case 'full':
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
        break;

      case 'top':
        cell.border = {
          top: { style: 'thin' },
        }
        break;

      case 'left':
        cell.border = {
          left: { style: 'thin' },
        }
        break;

      case 'bottom':
        cell.border = {
          bottom: { style: 'thin' },
        }
        break;

      case 'right':
        cell.border = {
          right: { style: 'thin' },
        }
        break;

      case 'tl':
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
        }
        break;

      case 'tr':
        cell.border = {
          top: { style: 'thin' },
          right: { style: 'thin' },
        }
        break;

      case 'bl':
        cell.border = {
          bottom: { style: 'thin' },
          left: { style: 'thin' },
        }
        break;

      case 'br':
        cell.border = {
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
        break;

      case 'tlb':
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
        }
        break;

      case 'trb':
        cell.border = {
          top: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' },
        }
        break;

      default:
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
        break;
    }
  }

}
