import { ServiceLifecycle } from '../common/service-lifecycle';

export class ReviewService extends ServiceLifecycle {
  public constructor() {
    super('ReviewService');
  }
}
