import { Routes } from '@angular/router';
import { ChangePasswordProtectSheetComponent } from 'app/pages/change-password-protect-sheet/change-password-protect-sheet.component';
import { LabelReportComponent } from 'app/pages/label-report/label-report.component';
import { MasterManageComponent } from 'app/pages/master-manage/master-manage.component';
import { ModelMasterManageComponent } from 'app/pages/model-master-manage/model-master-manage.component';
import { ModelMasterComponent } from 'app/pages/model-master/model-master.component';
import { PatternManageComponent } from 'app/pages/pattern-manage/pattern-manage.component';
import { QrcodeScanViewComponent } from 'app/pages/qrcode-scan-view/qrcode-scan-view.component';
import { QrcodeScanComponent } from 'app/pages/qrcode-scan/qrcode-scan.component';
import { RequestShipmentManageComponent } from 'app/pages/request-shipment-manage/request-shipment-manage.component';
import { RequestShipmentReportComponent } from 'app/pages/request-shipment-report/request-shipment-report.component';
import { RequestShipmentComponent } from 'app/pages/request-shipment/request-shipment.component';
// import { ScanLabelsQrcodeComponent } from 'app/pages/scan-labels-qrcode/scan-labels-qrcode.component';
import { ScanLabelsComponent } from 'app/pages/scan-labels/scan-labels.component';
import { UserManageComponent } from 'app/pages/user-manage/user-manage.component';

const path = "http://10.200.90.152:4014/Analysis-Report";

export const AdminLayoutRoutes: Routes = [

    { path: 'model-master', component: ModelMasterComponent },
    { path: 'model-master-manage', component: ModelMasterManageComponent },
    { path: 'request-shipment', component: RequestShipmentComponent },
    { path: 'request-shipment-manage', component: RequestShipmentManageComponent },
    { path: 'request-shipment-report', component: RequestShipmentReportComponent },
    { path: 'master-manage', component: MasterManageComponent },
    { path: 'pattern-manage', component: PatternManageComponent },
    { path: 'scan-labels', component: ScanLabelsComponent },
    // { path: 'scan-labels-qrcode', component: ScanLabelsQrcodeComponent },
    { path: 'qrcode-scan', component: QrcodeScanComponent },
    { path: 'qrcode-scan-view', component: QrcodeScanViewComponent },
    { path: 'user-manage', component: UserManageComponent },
    { path: 'label-report', component: LabelReportComponent },
    { path: 'change-password-protect-sheet', component: ChangePasswordProtectSheetComponent },


];
