import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { map, Observable, ReplaySubject } from 'rxjs';

// This code is modified from https://angular.io/guide/testing-components-scenarios#activatedroutestub

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<Params>(1);

  constructor(initialParams?: Params) {
    if (initialParams) {
      this.setParamMap(initialParams);
    }
  }

  /** The mock paramMap observable */
  get paramMap(): Observable<ParamMap> {
    return this.subject.pipe(map(convertToParamMap));
  }

  /** The mock params observable */
  get params(): Observable<Params> {
    return this.subject.asObservable();
  }

  /** Set the paramMap observables's next value */
  setParamMap(params: Params) {
    this.subject.next(params);
  }
}
