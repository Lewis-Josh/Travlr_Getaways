import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TripDataService } from '../services/trip-data';
import { TripFormService } from '../services/trip-form';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css',
})
export class EditTripComponent implements OnInit {
  public editForm!: FormGroup;
  public trip!: Trip;
  public submitted: boolean = false;
  public message: string = '';

  constructor(
    private router: Router,
    private tripDataService: TripDataService,
    private tripFormService: TripFormService
  ) { }

  public ngOnInit(): void {
    const tripCode = localStorage.getItem('tripCode');

    if (!tripCode) {
      this.message = 'No trip was selected for editing.';
      this.router.navigate(['']);
      return;
    }

    console.log('EditTripComponent::ngOnInit');
    console.log('tripCode: ' + tripCode);

    this.editForm = this.tripFormService.buildTripForm();

    this.tripDataService.getTrip(tripCode)
      .subscribe({
        next: (value: Trip[]) => {
          if (!value || value.length === 0) {
            this.message = 'No trip was retrieved.';
            console.log(this.message);
            return;
          }

          this.trip = value[0];

          this.editForm.patchValue({
            _id: this.trip._id,
            code: this.trip.code,
            name: this.trip.name,
            length: this.trip.length,
            start: this.formatDateForInput(this.trip.start),
            resort: this.trip.resort,
            perPerson: this.trip.perPerson,
            image: this.trip.image,
            description: this.trip.description
          });

          this.message = 'Trip: ' + tripCode + ' retrieved.';
          console.log(this.message);
        },
        error: (error: any) => {
          console.log('Error retrieving trip:', error);
          this.message = 'Unable to retrieve trip information.';
        }
      });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.message = '';

    if (this.editForm.invalid) {
      this.message = 'Please complete all required trip fields.';
      return;
    }

    this.tripDataService.updateTrip(this.editForm.value)
      .subscribe({
        next: (value: any) => {
          console.log('Trip updated:', value);
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.log('Error updating trip:', error);
          this.message = 'Unable to update trip. Please try again.';
        }
      });
  }

  private formatDateForInput(dateValue: Date | string): string {
    if (!dateValue) {
      return '';
    }

    return new Date(dateValue).toISOString().substring(0, 10);
  }

  public get f() {
    return this.editForm.controls;
  }
}