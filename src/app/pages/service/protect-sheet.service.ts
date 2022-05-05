import { Injectable } from '@angular/core';
import { ApiService } from 'app/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProtectSheetService {

  constructor(
    private api: ApiService
  ) { }

  async ProtectSheet() {
    const data = await this.getProtectSheet()
    //                                           (data);
    
    return data
  }
  getProtectSheet() {
    return new Promise(resolve => {
      this.api.getProtectSheet().subscribe(d => {
        resolve(d)
      })
    })
  }
}
