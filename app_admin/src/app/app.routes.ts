import { Routes } from '@angular/router';
import { AddTripComponent } from './add-trip/add-trip';
import { TripListingComponent } from './trip-listing/trip-listing';
import { EditTripComponent } from './edit-trip/edit-trip';
import { LoginComponent } from './login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: 'add-trip', component: AddTripComponent, canActivate: [authGuard] },
    { path: 'edit-trip', component: EditTripComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: '', component: TripListingComponent, pathMatch: 'full' }
];