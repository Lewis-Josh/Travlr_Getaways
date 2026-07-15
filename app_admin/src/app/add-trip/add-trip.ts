import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TripDataService } from '../services/trip-data';
import { TripFormService } from '../services/trip-form';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css',
})
export class AddTripComponent implements OnInit {
  public addForm!: FormGroup;
  public submitted: boolean = false;
  public message: string = '';

  constructor(
    private router: Router,
    private tripService: TripDataService,
    private tripFormService: TripFormService
  ) { }

  public ngOnInit(): void {
    this.addForm = this.tripFormService.buildTripForm();
  }

  public onSubmit(): void {
    this.submitted = true;
    this.message = '';

    if (this.addForm.invalid) {
      this.message = 'Please complete all required trip fields.';
      return;
    }

    this.tripService.addTrip(this.addForm.value)
      .subscribe({
        next: (data: any) => {
          console.log('Trip added:', data);
          this.message = 'Trip added successfully.';
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.log('Error adding trip:', error);
          this.message = 'Unable to add trip. Please try again.';
        }
      });
  }

  public get f() {
    return this.addForm.controls;
  }
}