import { Injectable } from '@angular/core';




@Injectable({
  providedIn: 'root'
})
export class MapDataService {

  SESSION_MODELID: any
  constructor() { }



  mapData(rawData) {
    this.SESSION_MODELID = localStorage.getItem('scan-model-id')
    return new Promise((resolve, reject) => {
      try {
        let newDataMap: any
        //                                           (rawData);
        newDataMap = rawData.map((shipment, indexShipment) => {

          shipment.ShipDate = ((shipment.ShipDate).split('T'))[0]
          // shipment.ShipDate = new Date(shipment.ShipDate).toDateString()
          //                                           (indexShipment, shipment);
          newDataMap = { ...this.setRequestShip(shipment) }

          const newBoxs = shipment.boxs.map((box, indexBox) => {
            //                                           (box);

            const newModels = box.Models.map((model, indexModel) => {
              //                                           (model);
              const modelUse = shipment.modelmasters.find(m => m._id === model.ModelId)
              const patternUse = shipment.pattern.find(p => p._id == modelUse.PatternLabelId)
              const newModel = { ...model }
              newModel['CustomerName'] = modelUse.CustomerName
              newModel['CustomerNo'] = modelUse.CustomerNo
              newModel['ModelCode'] = modelUse.ModelCode
              newModel['PartName'] = modelUse.PartName
              newModel['Size'] = modelUse.Size
              newModel['PatternName'] = patternUse.PatternName
              return newModel
            })
            //                                           (newModels);

            const newBox = { ...box }
            newBox['Models'] = newModels
            return newBox
          })

          const newShip = { ...shipment }
          newShip['boxs'] = newBoxs
          return newShip
          //                                           (newBoxs);

        })

        //                                           (newDataMap);

        resolve(newDataMap)
      } catch (error) {
        reject(error)
      }

    })
  }














  mapDataToBoxs(rawData) {
    this.SESSION_MODELID = localStorage.getItem('scan-model-id')

    //                                           (rawData);
    const oldData = rawData[0]
    let newData
    return new Promise((resolve, reject) => {
      try {
        const temp = this.setRequestShip(oldData.shipment[0])
        const temp2 = this.setDetailBox(oldData)
        const temp3 = this.setDetailModel(oldData)
        const temp4 = this.setHistories(oldData)
        newData = { ...temp, ...temp2, ...temp3, ...temp4 }
        //                                           (newData);


        resolve(newData)
      } catch (error) {
        reject(error)
      }

    })

  }

  setRequestShip(rawData: any) {
    let temp = {
      ShipCPRno: rawData.CPRno ? rawData.CPRno : '',
      ShipDate: rawData.ShipDate ? rawData.ShipDate : '',
      ShipPlace: rawData.ShipPlace ? rawData.ShipPlace : '',
      ShipTo: rawData.ShipTo ? rawData.ShipTo : '',
      ShipStatus: rawData.Status ? rawData.Status : '',
      User: rawData.User ? rawData.User : '',
      ShipID: rawData._id ? rawData._id : '',
    }
    return temp
  }

  setDetailBox(rawData: any) {
    let temp = {
      BoxName: rawData.Name,
      BoxStatus: rawData.Status,
      BoxTotalQty: rawData.TotalQty,
      BoxID: rawData._id
    }
    return temp
  }

  setDetailModel(rawData: any) {
    const modelUse = rawData.Models.find(m => m._id == this.SESSION_MODELID)
    //                                           (modelUse);

    const modelMaster = rawData.modelmasters.find(model => model._id == modelUse.ModelId)
    //                                           (modelMaster);
    const patternUse = rawData.patternlabels.find(p => p._id === modelMaster.PatternLabelId)

    //                                           (modelDatail);

    let temp = {
      ModelID: modelMaster._id,
      ModelInBoxID: this.SESSION_MODELID,
      CustomerName: modelMaster.CustomerName,
      CustomerNo: modelMaster.CustomerNo,
      ModelCode: modelMaster.ModelCode,
      ModelQty: modelUse.Qty,
      PartName: modelMaster.PartName,
      PatternName: patternUse.PatternName,
      PatternUse: patternUse
    }
    return temp
  }

  setHistories(rawData: any) {
    // const history = 
    let temp = {
      ScanHistories: rawData.scanhistories.filter(h => h.ModelInBoxId == this.SESSION_MODELID)
    }
    return temp
  }






  mapDataToLabel(shipment, box) {
    return new Promise(async (resolve, reject) => {
      let result: any = {
        scanhistories: shipment.scanhistories
      }
      try {
        const resultMapShipment: any = await this.mapShipment(shipment)
        const resultMapBox: any = await this.mapBox(box)
        result = { ...resultMapShipment, ...resultMapBox }
        resolve(result)
      } catch (error) {
        alert(error)
        reject(error)
      }
    })
  }

  mapShipment(shipment) {
    return new Promise((resolve, reject) => {
      const temp = {
        CPRno: shipment.CPRno || '',
        ShipDate: shipment.ShipDate || '',
        ShipPlace: shipment.ShipPlace || '',
        ShipTo: shipment.ShipTo || '',
        Status: shipment.Status || '',
        User: shipment.User || '',
        ShipID: shipment._id || '',
      }
      temp ? resolve(temp) : reject('error mapShipment')
    })
  }

  mapBox(box) {
    return new Promise(async (resolve, reject) => {
      const temp = {
        BoxName: box.Name || '',
        BoxStatus: box.Status || '',
        BoxTotalQty: box.TotalQty || '',
        ModelInBox: box.Models || [],
      }
      temp ? resolve(temp) : reject('error mapBox')
    })
  }









}
