import { isNil, isEmpty } from 'ramda';

export class SortValueConverter {
  toView(array, propertyName, direction) {
    if (isNil(array) || isEmpty(array)) {
      return array;
    } else {
      var factor = direction === 'ascending' ? 1 : -1;
      return array
        .slice(0)
        .sort((a, b) => {
          return (a[propertyName] - b[propertyName]) * factor;
        });
    }
  }
}
