import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

// export const ROUTES: RouteInfo[] = [
//     { path: '/dashboard', title: 'Dashboard', icon: 'nc-chart-bar-32', class: '' },
//     { path: '/requestform', title: 'Analysis Form Entry', icon: 'nc-paper', class: '' },
//     { path: '/manageForm', title: 'Manage Form', icon: 'nc-settings-gear-65', class: '' },
//     { path: '/masterlists', title: 'master list', icon: 'nc-tile-56', class: '' },

// ];
export const routesAdmin: RouteInfo[] = [
    // { path: '/model-master', title: 'Model master', icon: 'bi bi-card-list', class: '' },
    // { path: '/model-master-manage', title: 'Model master manage', icon: 'bi bi-card-list', class: '' },

    // { path: '/request-shipment', title: 'Request shipment', icon: 'bi-clipboard', class: '' },
    // { path: '/request-shipment-manage', title: 'Request shipment manage', icon: 'bi-clipboard', class: '' },

    // { path: '/scan-labels', title: 'Scan labels', icon: 'bi bi-qr-code-scan', class: '' },
    // { path: '/scan-labels-qrcode', title: 'Scan labels', icon: 'bi bi-qr-code-scan', class: '' },

    // { path: '/request-shipment-report', title: 'Shipment report', icon: 'bi bi-file-earmark-spreadsheet', class: '' },
    // { path: '/label-report', title: 'Label report', icon: 'bi bi-card-heading', class: '' },
    // { path: '/pattern-manage', title: 'Pattern manage', icon: 'bi bi-terminal-split', class: '' },
    // { path: '/master-manage', title: 'Master manage', icon: 'bi bi-layers', class: '' },
    // { path: '/user-manage', title: 'User manage', icon: 'bi bi bi-people', class: '' },


];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})



export class SidebarComponent implements OnInit {
    constructor(

    ){

    }

    pathLogo = environment.PATHLOGO
    public menuItems: any[];
    ngOnInit() {
        this.setSession()
    }

    async setSession() {

        try {
            await this.checkAccess()
            const authority: any = await this.checkAuthority()
            await this.itemsSidebar(authority)
        } catch (error) {
            alert(error)
        }


    }

    checkAccess() {
        return new Promise((resolve, reject) => {
            const access: any = localStorage.getItem('loginStatus');

            if (access == 'true') {
                resolve(true)
            } else {
                reject('Permission denied')
            }
        })
    }

    checkAuthority() {
        return new Promise((resolve, reject) => {
            const Status: any = localStorage.getItem('Status');
            if (Status == 'shipment') {
                resolve('shipment')
            } else
                if (Status == 'scan') {
                    resolve('scan')
                } else
                    if (Status == 'admin') {
                        resolve('admin')
                    } else {
                        reject('Permission denied')
                    }
        })
    }
    itemsSidebar(authority: any) {
        return new Promise((resolve, reject) => {
            let temp: any = []
            if (authority == "shipment") {
                temp = [
                    { path: '/request-shipment', title: 'Request shipment', icon: 'bi-clipboard', class: '' },
                    { path: '/request-shipment-report', title: 'Shipment report', icon: 'bi bi-file-earmark-spreadsheet', class: '' },
                    { path: '/label-report', title: 'Label report', icon: 'bi bi-card-heading', class: '' },

                ]
                resolve(true)
            } else
                if (authority == "scan") {
                    temp = [
                        { path: '/scan-labels', title: 'Scan labels', icon: 'bi bi-qr-code-scan', class: '' },
                        { path: '/label-report', title: 'Label report', icon: 'bi bi-card-heading', class: '' },
                    ]
                    resolve(true)

                } else
                    if (authority == "admin") {
                        temp = [
                            { path: '/request-shipment', title: 'Request shipment', icon: 'bi-clipboard', class: '' },
                            { path: '/scan-labels', title: 'Scan labels', icon: 'bi bi-qr-code-scan', class: '' },
                            { path: '/request-shipment-report', title: 'Shipment report', icon: 'bi bi-file-earmark-spreadsheet', class: '' },
                            { path: '/label-report', title: 'Label report', icon: 'bi bi-card-heading', class: '' },
                            { path: '/model-master', title: 'Model master', icon: 'bi bi-card-list', class: '' },
                            { path: '/master-manage', title: 'Master manage', icon: 'bi bi-layers', class: '' },
                            { path: '/pattern-manage', title: 'Pattern manage', icon: 'bi bi-terminal-split', class: '' },
                            { path: '/user-manage', title: 'User manage', icon: 'bi bi bi-people', class: '' },
                            { path: '/change-password-protect-sheet', title: 'Password sheet', icon: 'bi bi-key-fill', class: '' },

                        ]
                        resolve(true)
                    } else {
                        reject('Permission denied')
                    }
            this.menuItems = temp
        })
    }
}
