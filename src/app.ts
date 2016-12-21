import { inject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { reduxStore } from './store';
import { AuthenticationActions } from './actions/authentication';

@inject(reduxStore, AuthenticationActions)
export class App {
  router: Router;

  constructor(private store: any, private authActions: AuthenticationActions) {
    this.store.dispatch(this.authActions.watchAuthenticated());
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Swollen';
    config.map([
      { route: ['','dashboard'], name: 'dashboard', moduleId: 'dashboard/dashboard', nav: true, title: 'Leader Board' },
      // { route: 'track', name: 'track', moduleId: 'track/track', nav: true, title: 'Track' },
      { route: 'challenges', name: 'challenges', moduleId: 'challenges/challenges', nav: true, title: 'Challenges' }
    ]);

    this.router = router;
  }
}
