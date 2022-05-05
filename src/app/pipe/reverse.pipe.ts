import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value: any): unknown {
    // console.log(value,args);
    const result = [...value]
    return  result.reverse();
  }

}
