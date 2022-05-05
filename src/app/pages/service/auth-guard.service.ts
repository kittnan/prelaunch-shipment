import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'app/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  admin = [];
  shipment = [];
  scanner = [];

  constructor(
    private route: Router
  ) {
    this.admin = [
      '/change-password-protect-sheet',
      // '/label-report',
      '/user-manage',
      // '/qrcode-scan',
      // '/scan-labels',
      '/pattern-manage',
      '/master-manage',
      // '/request-shipment-report',
      // '/request-shipment-manage',
      // '/request-shipment',
      '/model-master-manage',
      '/model-master',
    ]
    this.shipment = [
      '/request-shipment-report',
      '/request-shipment-manage',
      '/request-shipment',
      '/label-report',
    ]
    this.scanner = [
      '/scan-labels',
      '/qrcode-scan',
      '/label-report',
    ]
  }

  CheckAuth() {
    const access = localStorage.getItem('Status')
    const url: any = this.route.url
    if (access == 'admin') {
      if (this.admin.find(u => u === url) === undefined) {
        this.route.navigate(['/login'])
      }
    }

    if (access == 'shipment') {
      if (this.shipment.find(u => u === url) === undefined) {
        this.route.navigate(['/login'])
      }
    }
    if (access == 'scan') {
      if (this.scanner.find(u => u === url) === undefined) {
        this.route.navigate(['/login'])
      }
    }


  }


}
