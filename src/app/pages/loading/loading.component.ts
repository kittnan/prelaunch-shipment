import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css'],
    standalone: false
})
export class LoadingComponent implements OnInit {

  @Input() load: boolean = false
  constructor() { }

  ngOnInit(): void {
  }

}
