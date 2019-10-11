import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatOnlyNames'
})
export class FormatOnlyNamesPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value) {
      return JSON.parse(value).map(genericItem => genericItem.name).join(', ');
    }
    return null;
  }

}
