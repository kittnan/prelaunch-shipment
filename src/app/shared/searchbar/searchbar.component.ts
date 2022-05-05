import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'app/api.service';
import { AlertServiceService } from 'app/pages/service/alert-service.service';
import { MapDataService } from 'app/pages/service/map-data.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {


  SearchForm = new FormGroup({
    ModelCode: new FormControl(''),
    ShipMentDate: new FormControl(''),
    CPRno: new FormControl('')
  })
  get SearchFormControl() { return this.SearchForm.controls }

  ModelMasterLists: any

  @Output() newItemEvent = new EventEmitter();

  constructor(
    private api: ApiService,
    private alertSwal: AlertServiceService,
  ) { }

  ngOnInit(): void {
    this.getModelMaster()
  }

  getModelMaster() {
    this.api.getModelMasters().toPromise().then(res => {
      this.ModelMasterLists = res
    })
  }

  onClickSearch() {
    this.api.searchShipmentAndLookup(this.SearchForm.value).toPromise().then(async res => {
      this.newItemEvent.emit(res)
    })
      .catch(error => {
        this.alertSwal.alert('error', error)
      })

  }



}
