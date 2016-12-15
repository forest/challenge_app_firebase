import { inject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { reduxStore } from './store';
import { watchAuthenticated } from './actions/authentication';

@inject(reduxStore)
export class App {
  router: Router;

  constructor(private store: any) {
    this.store.dispatch(watchAuthenticated());
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Swollen';
    config.map([
      { route: ['','dashboard'], name: 'dashboard', moduleId: 'dashboard/dashboard', nav: true, title: 'Leader Board' },
      { route: 'track', name: 'track', moduleId: 'track/track', nav: true, title: 'Track' }
    ]);

    this.router = router;
  }
}
