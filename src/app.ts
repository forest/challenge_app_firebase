import { autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

@autoinject
export class App {

  constructor() { }

  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Swollen';
    config.map([
      { route: ['','dashboard'], name: 'dashboard', moduleId: 'dashboard/dashboard', nav: true, title: 'Leader Board' },
      { route: 'track', name: 'track', moduleId: 'track/track', nav: true, title: 'Track' }
    ]);

    this.router = router;
  }
}
