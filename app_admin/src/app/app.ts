import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TripListingComponent } from './trip-listing/trip-listing';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TripListingComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Travlr Getaways Admin!');
}
