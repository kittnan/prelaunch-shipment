import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModelMasterComponent } from 'app/pages/model-master/model-master.component';
import { RequestShipmentComponent } from 'app/pages/request-shipment/request-shipment.component';
import { ModelMasterManageComponent } from 'app/pages/model-master-manage/model-master-manage.component';
import { RequestShipmentManageComponent } from 'app/pages/request-shipment-manage/request-shipment-manage.component';
import { MasterManageComponent } from 'app/pages/master-manage/master-manage.component';
import { PatternManageComponent } from 'app/pages/pattern-manage/pattern-manage.component';
import { ScanLabelsComponent } from 'app/pages/scan-labels/scan-labels.component';
import { ScanLabelsQrcodeComponent } from 'app/pages/scan-labels-qrcode/scan-labels-qrcode.component';
import { UserManageComponent } from 'app/pages/user-manage/user-manage.component';
import { RequestShipmentReportComponent } from 'app/pages/request-shipment-report/request-shipment-report.component';
import { LabelReportComponent } from 'app/pages/label-report/label-report.component';
import { SearchbarComponent } from 'app/shared/searchbar/searchbar.component';
import { ScanLabelTableComponent } from 'app/pages/scan-labels/scan-label-table/scan-label-table.component';
import { QrcodeScanComponent } from 'app/pages/qrcode-scan/qrcode-scan.component';
import { QrcodeScanTableComponent } from 'app/pages/qrcode-scan/qrcode-scan-table/qrcode-scan-table.component';
import { LabelReportTableComponent } from 'app/pages/label-report/label-report-table/label-report-table.component';
import { ChangePasswordProtectSheetComponent } from 'app/pages/change-password-protect-sheet/change-password-protect-sheet.component';
import { BoxStatusPipe } from 'app/pipe/box-status.pipe';
import { ShipStatusPipe } from 'app/pipe/ship-status.pipe';
import { ReversePipe } from 'app/pipe/reverse.pipe';
import { LoadingComponent } from 'app/pages/loading/loading.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  declarations: [
    ModelMasterComponent,
    RequestShipmentComponent,
    RequestShipmentManageComponent,
    RequestShipmentReportComponent,
    ModelMasterManageComponent,
    MasterManageComponent,
    PatternManageComponent,
    ScanLabelsComponent,
    ScanLabelsQrcodeComponent,
    UserManageComponent,
    LabelReportComponent,
    LabelReportTableComponent,
    SearchbarComponent,
    ScanLabelTableComponent,
    QrcodeScanComponent,
    QrcodeScanTableComponent,
    ChangePasswordProtectSheetComponent,

    BoxStatusPipe,
    ShipStatusPipe,
    ReversePipe,

    LoadingComponent

  ]
})

export class AdminLayoutModule { }
