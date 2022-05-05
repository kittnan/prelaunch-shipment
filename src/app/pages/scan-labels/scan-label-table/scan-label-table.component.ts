import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan-label-table',
  templateUrl: './scan-label-table.component.html',
  styleUrls: ['./scan-label-table.component.css']
})
export class ScanLabelTableComponent implements OnInit {

  @Input() ResultSearch: any
  constructor(
    private route: Router
  ) { }


  ngOnInit(): void {
  }
  onClickScan(box, model) {
    localStorage.setItem('scan-box-id', box._id)
    localStorage.setItem('scan-model-id', model._id)
    this.route.navigate(['/qrcode-scan'])
    // location.href = "#/qrcode-scan"
  }

  StatusScanModelInBox(shipment, box, model) {
    const total = shipment.scanhistories.filter(s => s.ModelInBoxId == model._id)
    return `${total.length} / ${model.Qty}`
  }

  StatusBox(shipment, box) {
    const numQty = box.Models.map(m => {
      const history = shipment.scanhistories.filter(s => s.ModelInBoxId == m._id).length
      return history
    })
    const totalQtyOfBox = numQty.reduce((prev, now) => {
      return prev + Number(now)
    },0)
    return `${totalQtyOfBox} / ${box.TotalQty}`
  }

}
