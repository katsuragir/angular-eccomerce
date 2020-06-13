// Angular
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { filter, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { defer, Observable, of } from 'rxjs';
// NGRX
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
// Auth actions
import { AuthActionTypes, Login, Logout, UserLoaded, UserRequested } from '../actions/auth.actions';
import { AuthLoginService } from '../services/auth.service';
import { AppState } from '../reducers';
import { environment } from '../../../environments/environment';
import { isUserLoaded } from '../selectors/auth.selectors';

@Injectable()
export class AuthEffects {
    @Effect({dispatch: false})
    login$ = this.actions$.pipe(
        ofType<Login>(AuthActionTypes.Login),
        tap(action => {
          const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
            localStorage.setItem(authTokenKey, action.payload.authToken);
            this.auth.isLoggedIn.next(true);
            this.store.dispatch(new UserRequested());
        }),
    );

    @Effect({dispatch: false})
    logout$ = this.actions$.pipe(
        ofType<Logout>(AuthActionTypes.Logout),
        tap(() => {
          const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
            localStorage.removeItem(authTokenKey);
            this.auth.isLoggedIn.next(false);
            this.router.navigate(['/pages/login'], {queryParams: {returnUrl: this.returnUrl}});
        })
    );
    /*
    @Effect({dispatch: false})
    register$ = this.actions$.pipe(
        ofType<Register>(AuthActionTypes.Register),
        tap(action => {
            localStorage.setItem(authTokenKey, action.payload.authToken);
        })
    );
    */
    @Effect({dispatch: false})
    loadUser$ = this.actions$
    .pipe(
        ofType<UserRequested>(AuthActionTypes.UserRequested),
        withLatestFrom(this.store.pipe(select(isUserLoaded))),
        filter(([action, _isUserLoaded]) => !_isUserLoaded),
        mergeMap(([action, _isUserLoaded]) => this.auth.getUserByToken()),
        tap(_user => {
            if (_user) {
                this.store.dispatch(new UserLoaded({ user: _user }));
            } else {
                this.store.dispatch(new Logout());
            }
        })
      );

    @Effect()
    init$: Observable<Action> = defer(() => {
      const authTokenKey = 'authce9d77b308c149d5992a80073637e4d5';
        const userToken = localStorage.getItem(authTokenKey);
        let observableResult = of({type: 'NO_ACTION'});
        if (userToken) {
            observableResult = of(new Login({  authToken: userToken }));
        }
        return observableResult;
    });

    private returnUrl: string;

    constructor(private actions$: Actions,
        private router: Router,
        private auth: AuthLoginService,
        private store: Store<AppState>) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
          this.returnUrl = event.url;
      }
    });
  }
}
