import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class TripFormService {
    constructor(private formBuilder: FormBuilder) { }

    public buildTripForm(): FormGroup {
        return this.formBuilder.group({
            _id: [''],
            code: ['', Validators.required],
            name: ['', Validators.required],
            length: ['', Validators.required],
            start: ['', Validators.required],
            resort: ['', Validators.required],
            perPerson: ['', Validators.required],
            image: ['', Validators.required],
            description: ['', Validators.required]
        });
    }
}