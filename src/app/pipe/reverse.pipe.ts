import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'reverse',
    standalone: false
})
export class ReversePipe implements PipeTransform {

  transform(value: any): unknown {
    const result = [...value]
    return  result.reverse();
  }

}
