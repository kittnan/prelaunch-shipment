import { Component } from '@angular/core';
import { HandleVersionService } from './handle-version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(
    private $handleVersion: HandleVersionService
  ) {

  }
  ngOnInit(): void {
    this.$handleVersion.start()
  }
}
