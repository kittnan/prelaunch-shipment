import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }
  Url: any = environment.UrlApi


  // * users
  getUsers(): Observable<any> {
    return this.http.get(this.Url + "/Users")
  }

  // * model master
  getModelMasters(): Observable<any> {
    return this.http.get(this.Url + "/ModelMaster")
  }
  // getModelMasters2(): Promise<any> {
  //   return this.http.get(this.Url + "/ModelMaster").toPromise()
  // }
  insertModelMaster(data: any): Observable<any> {
    return this.http.post(this.Url + "/ModelMaster", data)
  }
  deleteModelMaster(id: any): Observable<any> {
    return this.http.delete(this.Url + "/ModelMaster/" + id)
  }
  updataModelMaster(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/ModelMaster/" + id, data)
  }

  // * reuqest shipment
  insertRequestShipment(data: any): Observable<any> {
    return this.http.post(this.Url + "/Shipment", data)
  }
  getRequestShipment(): Observable<any> {
    return this.http.get(this.Url + "/Shipment")
  }
  searchRequestShipment(data: any): Observable<any> {
    return this.http.post(this.Url + "/ShipmentSearch", data)
  }
  searchShipmentAndLookup(data: any): Observable<any> {
    return this.http.post(this.Url + "/shipment/ShipmentSearch", data)
  }
  // searchRequestShipmentReport(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/Shipment/search/report", data)
  // }
  deleteRequestShipment(id: any): Observable<any> {
    return this.http.delete(this.Url + "/Shipment/" + id)
  }
  updateRequestShipment(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/Shipment/" + id, data)
  }
  searchCheckStatusShip(id: any): Observable<any> {
    return this.http.get(this.Url + "/shipment/checkStatusShip/" + id)
  }

  // * boxs
  insertBoxs(data: any): Observable<any> {
    return this.http.post(this.Url + "/Boxs", data)
  }
  // getBoxs(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/BoxsByCPRnoAndShipdate", data)
  // }
  getBoxsAll(): Observable<any> {
    return this.http.get(this.Url + "/Boxs")
  }
  getBoxs(data: any): Observable<any> {
    return this.http.post(this.Url + "/BoxsByCPRnoAndShipdate", data)
  }
  getBoxsByShipmentId(id: any): Observable<any> {
    return this.http.get(this.Url + "/Boxs/Shipment/" + id)
  }
  getBoxsById(id: any): Observable<any> {
    return this.http.get(this.Url + "/Boxs/" + id)
  }
  deleteBox(id: any): Observable<any> {
    return this.http.delete(this.Url + "/Boxs/" + id)
  }
  deleteMultiBox(id: any): Observable<any> {
    return this.http.delete(this.Url + "/Boxs/multi/" + id)
  }
  searchBoxs(data: any): Observable<any> {
    return this.http.post(this.Url + "/BoxsSearch", data)
  }
  updateBoxs(data: any): Observable<any> {
    return this.http.put(this.Url + "/UpdateMany", data)
  }
  updateBox(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/Boxs/" + id, data)
  }
  scanFullSearch(id: any): Observable<any> {
    return this.http.get(this.Url + "/Boxs/find/scan/" + id)
  }
  searchToCheckStatus(id: any): Observable<any> {
    return this.http.get(this.Url + "/Boxs/checkStatus/" + id)
  }



  // * master
  getMasters(): Observable<any> {
    return this.http.get(this.Url + "/MasterList")
  }
  updateMasters(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/MasterList/" + id, data)
  }

  // * pattern
  getPattern(): Observable<any> {
    return this.http.get(this.Url + "/PatternLabels")
  }
  insertPattern(data: any): Observable<any> {
    return this.http.post(this.Url + "/PatternLabels", data)
  }
  updatePattern(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/PatternLabels/" + id, data)
  }
  deletePattern(id: any): Observable<any> {
    return this.http.delete(this.Url + "/PatternLabels/" + id)
  }

  // * history scan
  insertHistory(data: any): Observable<any> {
    return this.http.post(this.Url + "/ScanHistory", data)
  }
  searchExportData(data: any): Observable<any> {
    return this.http.post(this.Url + "/ScanHistory/export/shipment/", data)
  }
  checkHistoryByBoxId(boxId: any): Observable<any> {
    return this.http.get(this.Url + "/ScanHistory/BoxId/" + boxId)
  }
  checkHistoryByShipmentId(shipmentId: any): Observable<any> {
    return this.http.get(this.Url + "/ScanHistory/ShipmentId/" + shipmentId)
  }
  updateHistory(data: any, id: any): Observable<any> {
    return this.http.put(this.Url + "/ScanHistory/BoxId/" + id, data)
  }
  deleteHistory(id: any): Observable<any> {
    return this.http.delete(this.Url + "/ScanHistory/" + id)
  }
  deleteMultiRow(data: any): Observable<any> {
    return this.http.post(this.Url + "/ScanHistory/multi/", data)
  }
  deleteHistoryAllByBoxId(boxId: any): Observable<any> {
    return this.http.delete(this.Url + "/ScanHistory/BoxId/all/" + boxId)
  }
  getCountScanHistoriesModelInBoxId(id: any): Observable<any> {
    return this.http.get(this.Url + "/ScanHistory/ModelInBoxId/" + id)
  }

  // * user
  insertUser(data: any): Observable<any> {
    return this.http.post(this.Url + "/Users/insert", data)
  }
  updateUser(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/Users/update/" + id, data)
  }
  deleteUser(id: any): Observable<any> {
    return this.http.delete(this.Url + "/Users/delete/" + id)
  }

  // * password-protect-sheet
  getProtectSheet(): Observable<any> {
    return this.http.get(this.Url + "/SheetProtect")
  }
  insertProtectSheet(data: any): Observable<any> {
    return this.http.post(this.Url + "/SheetProtect/insert", data)
  }
  updateProtectSheet(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/SheetProtect/update/" + id, data)
  }
  deleteProtectSheet(id: any): Observable<any> {
    return this.http.delete(this.Url + "/SheetProtect/delete/" + id)
  }

  // * check duplicate in data base
  checkDuplicateInDatabase(data: any): Observable<any> {
    return this.http.post(this.Url + "/ScanHistory/search", data)
  }

}
