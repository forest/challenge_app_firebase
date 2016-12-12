export class JsonValueConverter {
  toView(value){
    return value && JSON.stringify(value);
  }
}
