import { Injectable } from '@angular/core';
import { ApiService } from 'app/api.service';

import { Workbook } from 'exceljs'
import * as fs from 'file-saver';
import { ProtectSheetService } from './protect-sheet.service';
@Injectable({
  providedIn: 'root'
})
export class GenerateShipmentReportService {


  ProtectSheetSheet: any

  constructor(
    private api: ApiService,
    private protectSheet: ProtectSheetService

  ) { }

  onGenerateShipment(formSearch) {
    this.api.searchExportData(formSearch).toPromise().then(async res => {
      //                                           (res);
      const resultProtectSheet: any = await this.protectSheet.ProtectSheet()
      this.ProtectSheetSheet = resultProtectSheet.find(m => m.Name == 'Password-Sheet')
      
      const resultMap = await this.onMap(res)
      this.exportExcel(resultMap, res)
    })
  }


  onMap(rawData) {
    return new Promise((resolve, reject) => {
      //                                           (rawData);
      const resultMap = rawData.map((d, index) => {
        const temp = []
        temp.push(index + 1)
        temp.push(d.Lot)
        temp.push(d.boxs[0].Name)
        temp.push(this.setFormatDateShipment(d.shipment[0].ShipDate))
        temp.push(d.shipment[0].CPRno)
        const modelInBox = d.boxs[0].Models.find(m => m._id == d.ModelInBoxId)
        //                                           (modelInBox);
        const modelMasterUse = d.model.find(m => m._id == modelInBox.ModelId)
        //                                           (modelMasterUse);

        temp.push(modelMasterUse.ModelCode)
        temp.push(modelMasterUse.PartName)
        temp.push(d.Label)
        temp.push(d.Label.length)
        temp.push(d.Serial)
        temp.push(modelMasterUse.CustomerNo)
        return temp
      })
      //                                           (resultMap);
      resultMap ? resolve(resultMap) : reject('error on map')
    })

  }

  async exportExcel(datas: any, rawData: any) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('record', {
      views: [{ showGridLines: false }],

    });

    const widthCell = 10
    worksheet.columns = [
      { width: widthCell },
      { width: widthCell + 5 },
      { width: widthCell },
      { width: widthCell + 20 },
      { width: widthCell + 15 },
      { width: widthCell + 15 },
      { width: widthCell + 25 },
      { width: widthCell + 40 },
      { width: widthCell },
      { width: widthCell + 10 },
      { width: widthCell + 10 },
    ];
    worksheet.mergeCells('A1:K1');
    worksheet.getCell('A1').value = "Shipment record pre-launch model"
    worksheet.getCell('A1').font = {
      size: 28,
      bold: true
    };
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
    // const totalQty: any = await this.getTotalQty(rawData)


    worksheet.addRow([`Total shipment Qty: ${datas.length}`]);
    worksheet.getRow(2).font = {
      size: 14,
      bold: true
    }
    worksheet.mergeCells('A2:C2')

    worksheet.insertRow(5, ['No', 'Product Lot', 'BOX No', 'Date Shipment', 'CPR', 'Model Name', 'Part Name', 'Product label', 'Digit', 'Serial no', 'Customer no']);
    await this.mapRow(datas, worksheet)

    worksheet.eachRow((row, rowNum) => {
      if (rowNum >= 5) {
        row.eachCell((Cell, cellNum) => {
          Cell.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          }


        })
      }

      row.eachCell((cell, numCell) => {
        cell.border = {
          left: { style: 'thin' },
          top: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        }
      })
    })


    await worksheet.protect(this.ProtectSheetSheet.Password, {});
    workbook.xlsx.writeBuffer().then(async (data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      })
      const fileName: any = `record-shipment-${new Date().toLocaleDateString()}`
      fs.saveAs(blob, fileName)

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

  mapRow(datas: any, worksheet: any) {
    return new Promise((resolve, reject) => {
      datas.map(element => {
        worksheet.addRow([...element]);
      });
      resolve(true)
    })
  }

  async exportOnRow(items) {
    const resultProtectSheet: any = await this.protectSheet.ProtectSheet()
    this.ProtectSheetSheet = resultProtectSheet.find(m => m.Name == 'Password-Sheet')
    //                                           (items);
    const resultMap = items.scanhistories.map(history => {
      let temp = { ...history }
      let tempModel

      const box = items.boxs.find(box => {
        tempModel = box.Models.find(model => model._id == history.ModelInBoxId)
        if (tempModel) {
          return box
        }
      })

      const boxs = [box]
      temp['boxs'] = boxs

      const shipment = [{
        _id: items._id,
        ShipDate: items.ShipDate,
        ShipPlace: items.ShipPlace,
        ShipTo: items.ShipTo,
        CPRno: items.CPRno,
        User: items.User,
        Status: items.Status,
      }]
      temp['shipment'] = shipment
      //                                           (box);
      // //                                           (tempModel);
      const modelMasterUse = items.modelmasters.find(m => m._id == tempModel.ModelId)
      //                                           (modelMasterUse);
      const model = [modelMasterUse]
      temp['model'] = model
      //                                           (temp);

      return temp

    })
    //                                           (resultMap);
    const resultonMap = await this.onMap(resultMap)
    this.exportExcel(resultonMap, items)
  }
}