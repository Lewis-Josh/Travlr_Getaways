import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user';
import { AuthResponse } from '../auth-response';
import { Trip } from '../models/trip';

@Injectable({
    providedIn: 'root'
})
export class TripDataService {
    private readonly baseUrl = 'http://localhost:3000/api';
    private readonly tripsUrl = `${this.baseUrl}/trips`;

    constructor(private http: HttpClient) { }

    public getTrips(): Observable<Trip[]> {
        return this.http.get<Trip[]>(this.tripsUrl);
    }

    public addTrip(formData: Trip): Observable<Trip> {
        return this.http.post<Trip>(this.tripsUrl, formData);
    }

    public getTrip(tripCode: string): Observable<Trip[]> {
        return this.http.get<Trip[]>(`${this.tripsUrl}/${tripCode}`);
    }

    public updateTrip(formData: Trip): Observable<Trip> {
        return this.http.put<Trip>(
            `${this.tripsUrl}/${formData.code}`,
            formData
        );
    }

    public login(user: User, passwd: string): Observable<AuthResponse> {
        return this.handleAuthAPICall('login', user, passwd);
    }

    public register(user: User, passwd: string): Observable<AuthResponse> {
        return this.handleAuthAPICall('register', user, passwd);
    }

    private handleAuthAPICall(
        endpoint: string,
        user: User,
        passwd: string
    ): Observable<AuthResponse> {
        const formData = {
            name: user.name,
            email: user.email,
            password: passwd
        };

        return this.http.post<AuthResponse>(
            `${this.baseUrl}/${endpoint}`,
            formData
        );
    }
}