import { createSelector } from 'reselect'
import * as R from 'ramda';
import * as moment from 'moment';
import { Types } from '../types'

export const getConfig = (state) => state.config

export function getCurrentUser(state): Types.IAuthenticatedUser {
  return state.appState.currentUser;
}
export function isUserLoggedIn(state): boolean {
  return !!state.appState.currentUser;
}

export const getResults = (state) => state.results.data

export const getChallengesState = (state) => state.challenges
export const getChallenges = (state) => state.challenges.data
export const getCurrentChallenge = (state) => state.appState.currentChallenge

const getChallengeResults = createSelector(
  getResults,
  getCurrentChallenge,
  (results, challenge) => R.propOr({}, R.propOr(null, 'key', challenge), results)
)

export const getStats = createSelector(
  getChallengeResults,
  (results) => {
    if (results) {
      let resultsData = R.values(results);

      return ChallengeStatistics.calculate(resultsData);
    }

    return null;
  }
)

export const getTodaysStats = createSelector(
  getStats,
  (stats) => {
    if (stats) {
      let todaysStats = stats[moment().format("L")] || [];
      // TODO: swap uid for user name
      // R.map((stat) => Object.assign({}, stat, {name: users[stat["name"]]}), today)
      return todaysStats;
    }

    return null;
  }
)

export const getTodaysStatsForCurrentUser = createSelector(
  getCurrentUser,
  getStats,
  (user, stats) => {
    if (user && stats) {
      let todaysStats = stats[moment().format("L")] || [];
      // TODO: swap uid for user name
      // R.map((stat) => Object.assign({}, stat, {name: users[stat["name"]]}), today)
      return R.find(R.propEq('uid', user.uid), todaysStats);
    }

    return null;
  }
)


// Calcuate challenges statistics
namespace ChallengeStatistics {
  const byDay = R.groupBy((result) => {
    return moment(result.timestamp).format("L");
  });

  const total = R.reduceBy((acc, result) => acc + 1, 0);
  const totalsByMember = total((result) => {
    return result.uid;
  });

  // { "acbd": 5 } => { "uid": "abcd", "total": 5 }
  const convertToKeyedObject = R.mapObjIndexed((total, uid, obj) => ({ "uid": uid, "total": total }))

  // given results for a challenge, calcuate statistics by day
  // :: [{uid (string), timestamp (number)}] -> {day (string): [uid (string), total (number)]}
  export const calculate = R.pipe(
    byDay,
    R.map(R.pipe(
      totalsByMember,
      convertToKeyedObject,
      R.values
    ))
  );
}
