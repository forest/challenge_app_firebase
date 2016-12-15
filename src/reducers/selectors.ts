import { createSelector } from 'reselect'
import * as R from 'ramda';
import * as moment from 'moment';
import { Types } from '../types'

export const getConfig = (state) => state.config

export const getResults = (state) => state.results
export function getCurrentUser(state): Types.IAuthenticatedUser {
  return state.appState.currentUser;
}
export function isUserLoggedIn(state): boolean {
  return !!state.appState.currentUser;
}


export const getChallengesState = (state) => state.challenges
export const getChallenges = (state) => state.challenges.items
export const getCurrentChallenge = (state) => state.currentChallenge

const getChallengeResults = createSelector(
  getResults,
  getCurrentChallenge,
  (results, challenge) => results[challenge.key]
)

export const getStats = createSelector(
  getChallengeResults,
  (results) => {
    let resultsData = R.values(results);

    // return R.map((day) => totalsByMember(day), byDay(resultsData))
    return R.map((day) => R.values(R.mapObjIndexed((total, name, obj) => ({"name": name, "total": total}), totalsByMember(day))), byDay(resultsData));
  }
)

export const getTodaysStats = createSelector(
  getStats,
  (stats) => {
    let todaysStats = stats[moment().format("L")] || [];
    return todaysStats;
  }
)

// helpers to calcuate challenges statistics
let byDay = R.groupBy((result) => {
  return moment(result.timestamp).format("L");
});

let reduceToTotalsBy = R.reduceBy((acc, result) => acc + 1, 0);
let totalsByMember = reduceToTotalsBy((result) => {
  return result.name;
});
