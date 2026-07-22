import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TripCardComponent } from '../trip-card/trip-card';
import { TripDataService } from '../services/trip-data';
import { TripRecommendationService } from '../services/trip-recommendation';
import { Trip } from '../models/trip';
import {
  DEFAULT_TRIP_SEARCH_CRITERIA,
  TRIP_SORT_OPTIONS,
  TripRecommendation,
  TripSearchCriteria
} from '../models/trip-recommendation';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, TripCardComponent],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
})
export class TripListingComponent implements OnInit {
  public trips: Trip[] = [];
  public recommendationResults: TripRecommendation[] = [];

  public searchCriteria: TripSearchCriteria = {
    ...DEFAULT_TRIP_SEARCH_CRITERIA
  };

  public sortOptions = TRIP_SORT_OPTIONS;
  public message: string = '';
  public hasSearched: boolean = false;

  constructor(
    private tripDataService: TripDataService,
    private tripRecommendationService: TripRecommendationService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.getTrips();
  }

  private getTrips(): void {
    console.log('TripListingComponent::getTrips');

    this.tripDataService.getTrips()
      .subscribe({
        next: (value: Trip[]) => {
          this.trips = value || [];
          this.recommendationResults = [];
          this.hasSearched = false;

          this.message = this.trips.length > 0
            ? 'Trips loaded successfully. Enter criteria to generate ranked recommendations.'
            : 'No trips were found.';

          console.log('Trips loaded:', this.trips);
          this.changeDetector.detectChanges();
        },
        error: (error: any) => {
          console.log('Error retrieving trips:', error);
          this.trips = [];
          this.recommendationResults = [];
          this.hasSearched = false;
          this.message = 'Unable to retrieve trips.';
          this.changeDetector.detectChanges();
        }
      });
  }

  public onSearch(): void {
    console.log('Recommendation criteria:', this.searchCriteria);

    this.hasSearched = true;

    this.recommendationResults =
      this.tripRecommendationService.getRecommendations(
        this.trips,
        this.searchCriteria
      );

    this.message = this.recommendationResults.length > 0
      ? `${this.recommendationResults.length} recommended trip(s) found.`
      : 'No trips matched the selected recommendation criteria.';

    this.changeDetector.detectChanges();
  }

  public onClearSearch(): void {
    this.hasSearched = false;

    this.searchCriteria = {
      ...DEFAULT_TRIP_SEARCH_CRITERIA
    };

    this.recommendationResults = [];
    this.message = 'Recommendation criteria cleared. Showing all trips.';

    this.changeDetector.detectChanges();
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  public get hasTrips(): boolean {
    return this.trips.length > 0;
  }

  public get hasRecommendationResults(): boolean {
    return this.recommendationResults.length > 0;
  }
}