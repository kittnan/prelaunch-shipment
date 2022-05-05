import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'shipStatus'
})
export class ShipStatusPipe implements PipeTransform {

  transform(status: unknown): string {
    let result: string = ''
    if (status == 1) {
      result = 'Success'
    }else{
      result = 'Not success'
    }
    return result
  }

}
