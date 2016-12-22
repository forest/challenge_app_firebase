import * as firebase from 'firebase';
import { last, split, keys, defaultTo } from 'ramda';

export namespace FirebaseUtils {
  /**
   * Helper to get a record from a Firebase snapshot.
   *
   * @param {DataSnapshot} snapshot.
   * @returns {*} record with key.
   */
  export function recordFromSnapshot(snapshot: firebase.database.DataSnapshot): any {
    let record = snapshot.val();
    record.key = snapshot.key;
    return record;
  }


  /**
   * https://github.com/forest/firebase-relation-collector
   *
   *     // Defaults to last in path 'items'
   *     collect(ref, 'accounts/myaccount/items')
   *       .then(console.log); // [{ "id": "child1", "some": "prop" }, { "id": "child2" }]
   *
   *     // Specify a location of relations
   *     collect(ref, 'members/mymembership/friends', 'members')
   *       .then(console.log) // [{ "some": "member", "my": "other friend" }]
   *
   * @export
   * @param {firebase.database.Reference} ref
   * @param {string} path
   * @param {string} specificKey
   * @returns {*}
   */
  export function collect(ref: firebase.database.Reference, path: string, specificKey: string = null): any {
    return new Promise(resolve => {
      const defaultLastInPath = defaultTo(last(split('/', path)));
      const relationPath = defaultLastInPath(specificKey);

      const keysRef = ref.child(path);
      const relationRef = ref.child(relationPath);

      keysRef.once('value', snapshot => {
        const childKeys = keys(snapshot.val());
        Promise.all(childKeys.map(key => fetch(relationRef.child(key))))
          .then(resolve);
      });
    });
  };

  function fetch(ref: firebase.database.Reference) {
    return new Promise(resolve => {
      ref.once('value', snapshot => {
        resolve(recordFromSnapshot(snapshot));
      });
    });
  }
}
