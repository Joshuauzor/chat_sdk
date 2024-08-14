import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateMessage'
})
export class DateMessagePipe implements PipeTransform {

  transform(seconds: number, ...args: unknown[]): unknown {
    const date = new Date(seconds).getTime();
    const today = new Date().getTime();

    const diffMs = (today - date);
    const diffDays = Math.abs(Math.floor(diffMs / 86400000));
    const diffHrs = Math.abs(Math.floor((diffMs % 86400000) / 3600000));
    const diffMins = Math.abs(Math.round(((diffMs % 86400000) % 3600000) / 60000));

    let msg = `Ahora`;
    if (diffDays > 0 ) { 
      msg = new Date(date).toLocaleDateString() 
    } else {
      if (diffHrs > 0) {
        msg = `hace ${diffHrs}`;
        if (diffHrs === 1) {
          msg += ` hora`;
        } else {
          msg += ` horas`;
        }
      } else {
        if (diffMins > 0 ){
          msg = `hace ${diffMins}`;
          if (diffMins === 1) {
            msg += ` minuto`;
          } else {
            msg += ` minutos`;
          }
        }
      }
    }
    return msg;
  }

}