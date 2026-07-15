import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../auth-response';
import { TripDataService } from './trip-data';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private readonly tokenKey = 'travlr-token';

    private loggedInStatus = new BehaviorSubject<boolean>(false);
    public loggedInStatus$ = this.loggedInStatus.asObservable();

    authResp: AuthResponse = new AuthResponse();

    constructor(
        @Inject(BROWSER_STORAGE) private storage: Storage,
        private tripDataService: TripDataService
    ) {
        this.loggedInStatus.next(this.isLoggedIn());
    }

    public getToken(): string {
        const token = this.storage.getItem(this.tokenKey);
        return token ? token : '';
    }

    public saveToken(token: string): void {
        if (token) {
            this.storage.setItem(this.tokenKey, token);
            this.loggedInStatus.next(true);
        }
    }

    public logout(): void {
        this.storage.removeItem(this.tokenKey);
        this.loggedInStatus.next(false);
    }

    private decodeTokenPayload(): any | null {
        const token = this.getToken();

        if (!token) {
            return null;
        }

        const tokenParts = token.split('.');

        if (tokenParts.length !== 3) {
            this.logout();
            return null;
        }

        try {
            let payload = tokenParts[1]
                .replace(/-/g, '+')
                .replace(/_/g, '/');

            while (payload.length % 4) {
                payload += '=';
            }

            return JSON.parse(atob(payload));
        } catch (error) {
            console.log('Invalid token payload');
            this.logout();
            return null;
        }
    }

    public isLoggedIn(): boolean {
        const payload = this.decodeTokenPayload();

        if (!payload || !payload.exp) {
            return false;
        }

        const isValid = payload.exp > Date.now() / 1000;

        if (!isValid) {
            this.logout();
        }

        return isValid;
    }

    public getCurrentUser(): User {
        const payload = this.decodeTokenPayload();

        if (!payload) {
            return new User();
        }

        return {
            email: payload.email || '',
            name: payload.name || ''
        } as User;
    }

    public login(user: User, passwd: string) {
        return this.tripDataService.login(user, passwd)
            .pipe(
                tap((value: AuthResponse) => {
                    if (value && value.token) {
                        this.authResp = value;
                        this.saveToken(this.authResp.token);
                    }
                })
            );
    }

    public register(user: User, passwd: string): void {
        this.tripDataService.register(user, passwd)
            .subscribe({
                next: (value: AuthResponse) => {
                    if (value && value.token) {
                        console.log(value);
                        this.authResp = value;
                        this.saveToken(this.authResp.token);
                    }
                },
                error: (error: any) => {
                    console.log('Error: ' + error);
                    this.logout();
                }
            });
    }
}