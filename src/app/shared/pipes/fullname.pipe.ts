import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../layouts/dashboard/pages/users/models/user';

@Pipe({
  name: 'fullname',
})
export class FullnamePipe implements PipeTransform {
  transform(value: User, ...args: unknown[]): unknown {
    const firstArg = args[0];
    const result = `${value.firstName} ${value.lastName}`;

    switch (firstArg) {
      case 'lowercase':
        return result.toLowerCase();
      case 'uppercase':
        return result.toUpperCase();
      default:
        return result;
    }
  }
}
