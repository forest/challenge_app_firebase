/**
 * Filter function type definition.
 *
 * @export
 * @interface FilterFunc
 */
export interface FilterFunc {
  (searchTerm: string, item: any): boolean;
}

/**
 * A value converter that can be used to generically filter a list.
 *
 * @export
 * @class FilterValueConverter
 */
export class FilterValueConverter {
  /**
   * (description)
   *
   * @param {Array<any>} list Items to filter.
   * @param {string} searchTerm Term to filter items by.
   * @param {FilterFunc} filterFunc Implementation of filter.
   * @returns {Array<any>} Filtered list.
   */
  toView(list: Array<any>, searchTerm: string, filterFunc: FilterFunc): Array<any> {
    return list.filter((item) => {
      let matches = searchTerm && searchTerm.length > 0 ? filterFunc(searchTerm, item) : true;

      return matches;
    });
  }
}

