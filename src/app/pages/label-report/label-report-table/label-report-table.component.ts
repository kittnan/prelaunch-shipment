import { Component, Input, OnInit } from '@angular/core';
import { GenerateLabelService } from 'app/pages/service/generate-label.service';
import { MapDataService } from 'app/pages/service/map-data.service';

@Component({
  selector: 'app-label-report-table',
  templateUrl: './label-report-table.component.html',
  styleUrls: ['./label-report-table.component.css']
})
export class LabelReportTableComponent implements OnInit {

  @Input() Rows: any

  ToggleTableBoxs: boolean = false
  ToggleTableModels: boolean = false

  test: any;
  constructor(
    private map: MapDataService,
    private generateLabel: GenerateLabelService,
  ) { }

  ngOnInit(): void {

  }

  async onClickExportLabel(row, box) {
    const resultMap = await this.map.mapDataToLabel(row, box)
    this.generateLabel.exportLabel(resultMap)
  }

  onCheckPrintLabel(row, box) {
    const allHistoryScan = box.Models.map(model => {
      return row.scanhistories.filter(scan => scan.ModelInBoxId == model._id)
    })
    const totalScanHistory = allHistoryScan.reduce((prev, now) => {
      return prev + now.length
    }, 0)
    if (box.TotalQty == totalScanHistory) {
      return false
    }
    return true
  }

}
