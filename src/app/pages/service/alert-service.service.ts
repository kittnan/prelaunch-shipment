import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor() { }

  alert(icon, text) {
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton:false
    })

    toast.fire({
      title: text,
      icon: icon,

    })
  }

}
