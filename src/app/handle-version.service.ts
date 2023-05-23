import { Subscription, interval } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HandleVersionService {
  private interval$!: Subscription;
  constructor(
    private _router: Router,
  ) { }
  start() {
    this.interval$ = interval(3000).subscribe(res => this.handleVersion())
  }
  private handleVersion() {
    let bypassPathList = [
      "/",
      "/login"
    ]
    if (!bypassPathList.find((p: string) => p === this._router.url)) {
      if (localStorage.getItem('PLS_version') !== environment.VERSION) {
        if (confirm("New version available. Load New Version?")) {
          this.interval$.unsubscribe()
          localStorage.setItem('PLS_version', environment.VERSION)
          window.location.reload();
        }
      }
    }
  }

}
