import * as firebase from 'firebase';

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
