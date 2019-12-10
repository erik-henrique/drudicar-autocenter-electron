import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayNames'
})
export class DisplayNamesPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value) {
      return JSON.parse(value)
        .map(item => item.name)
        .join(', ');
    }

    return null;
  }
}
