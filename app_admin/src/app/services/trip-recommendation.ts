import { Injectable } from '@angular/core';

import { Trip } from '../models/trip';
import {
    DEFAULT_TRIP_SEARCH_CRITERIA,
    RECOMMENDATION_SCORE_WEIGHTS,
    TripRecommendation,
    TripSearchCriteria,
    TripSortOption
} from '../models/trip-recommendation';

@Injectable({
    providedIn: 'root'
})
export class TripRecommendationService {

    public getRecommendations(
        trips: Trip[],
        criteria: TripSearchCriteria
    ): TripRecommendation[] {
        const cleanCriteria = this.normalizeCriteria(criteria);

        const recommendations = trips
            .map((trip: Trip) => this.buildRecommendation(trip, cleanCriteria))
            .filter((recommendation: TripRecommendation) => {
                return this.shouldIncludeRecommendation(recommendation, cleanCriteria);
            });

        return this.sortRecommendations(recommendations, cleanCriteria.sortBy);
    }

    private buildRecommendation(
        trip: Trip,
        criteria: TripSearchCriteria
    ): TripRecommendation {
        const parsedPrice = this.parsePrice(trip.perPerson);
        const parsedLength = this.parseLength(trip.length);
        const parsedStartDate = this.parseStartDate(trip.start);

        let score = 0;
        const reasons: string[] = [];

        const keyword = this.toSafeString(criteria.keyword).toLowerCase();
        const maxPrice = this.parseSearchNumber(criteria.maxPrice);
        const minLength = this.parseSearchNumber(criteria.minLength);
        const maxLength = this.parseSearchNumber(criteria.maxLength);
        const preferredStartDate = this.parseStartDate(criteria.startDate);

        if (keyword) {
            if (this.matchesPrimaryTripFields(trip, keyword)) {
                score += RECOMMENDATION_SCORE_WEIGHTS.keywordMatch;
                reasons.push('Trip name, code, or resort matched the search keyword.');
            }

            if (this.matchesDescription(trip, keyword)) {
                score += RECOMMENDATION_SCORE_WEIGHTS.descriptionMatch;
                reasons.push('Trip description matched the search keyword.');
            }
        }

        if (maxPrice !== null && parsedPrice > 0 && parsedPrice <= maxPrice) {
            score += RECOMMENDATION_SCORE_WEIGHTS.priceMatch;
            reasons.push('Trip price is within the preferred budget.');
        }

        if (this.lengthMatches(parsedLength, minLength, maxLength)) {
            score += RECOMMENDATION_SCORE_WEIGHTS.lengthMatch;
            reasons.push('Trip length is within the preferred range.');
        }

        if (
            preferredStartDate &&
            parsedStartDate &&
            parsedStartDate >= preferredStartDate
        ) {
            score += RECOMMENDATION_SCORE_WEIGHTS.startDateMatch;
            reasons.push('Trip start date is on or after the preferred start date.');
        }

        if (reasons.length === 0 && !this.hasActiveCriteria(criteria)) {
            reasons.push('No search criteria entered; displaying available trip.');
        }

        return {
            trip: trip,
            score: score,
            reasons: reasons,
            parsedPrice: parsedPrice,
            parsedLength: parsedLength,
            parsedStartDate: parsedStartDate
        };
    }

    private shouldIncludeRecommendation(
        recommendation: TripRecommendation,
        criteria: TripSearchCriteria
    ): boolean {
        if (!this.hasActiveCriteria(criteria)) {
            return true;
        }

        const keyword = this.toSafeString(criteria.keyword).toLowerCase();
        const maxPrice = this.parseSearchNumber(criteria.maxPrice);
        const minLength = this.parseSearchNumber(criteria.minLength);
        const maxLength = this.parseSearchNumber(criteria.maxLength);
        const preferredStartDate = this.parseStartDate(criteria.startDate);

        if (
            keyword &&
            !this.matchesPrimaryTripFields(recommendation.trip, keyword) &&
            !this.matchesDescription(recommendation.trip, keyword)
        ) {
            return false;
        }

        if (
            maxPrice !== null &&
            (
                recommendation.parsedPrice === 0 ||
                recommendation.parsedPrice > maxPrice
            )
        ) {
            return false;
        }

        if (
            minLength !== null &&
            (
                recommendation.parsedLength === 0 ||
                recommendation.parsedLength < minLength
            )
        ) {
            return false;
        }

        if (
            maxLength !== null &&
            (
                recommendation.parsedLength === 0 ||
                recommendation.parsedLength > maxLength
            )
        ) {
            return false;
        }

        if (
            preferredStartDate &&
            (
                !recommendation.parsedStartDate ||
                recommendation.parsedStartDate < preferredStartDate
            )
        ) {
            return false;
        }

        return recommendation.score > 0;
    }

    private sortRecommendations(
        recommendations: TripRecommendation[],
        sortBy: TripSortOption
    ): TripRecommendation[] {
        const sortedRecommendations = [...recommendations];

        sortedRecommendations.sort((first, second) => {
            switch (sortBy) {
                case 'priceLowToHigh':
                    return this.sortByPriceLowToHigh(first, second);

                case 'priceHighToLow':
                    return this.sortByPriceHighToLow(first, second);

                case 'startDate':
                    return this.sortByStartDate(first, second);

                case 'name':
                    return this.sortByName(first, second);

                case 'bestMatch':
                default:
                    return this.sortByBestMatch(first, second);
            }
        });

        return sortedRecommendations;
    }

    private sortByBestMatch(
        first: TripRecommendation,
        second: TripRecommendation
    ): number {
        if (second.score !== first.score) {
            return second.score - first.score;
        }

        return this.sortByPriceLowToHigh(first, second);
    }

    private sortByPriceLowToHigh(
        first: TripRecommendation,
        second: TripRecommendation
    ): number {
        if (first.parsedPrice !== second.parsedPrice) {
            return first.parsedPrice - second.parsedPrice;
        }

        return this.sortByName(first, second);
    }

    private sortByPriceHighToLow(
        first: TripRecommendation,
        second: TripRecommendation
    ): number {
        if (first.parsedPrice !== second.parsedPrice) {
            return second.parsedPrice - first.parsedPrice;
        }

        return this.sortByName(first, second);
    }

    private sortByStartDate(
        first: TripRecommendation,
        second: TripRecommendation
    ): number {
        const firstDate = first.parsedStartDate
            ? first.parsedStartDate.getTime()
            : Number.MAX_SAFE_INTEGER;

        const secondDate = second.parsedStartDate
            ? second.parsedStartDate.getTime()
            : Number.MAX_SAFE_INTEGER;

        if (firstDate !== secondDate) {
            return firstDate - secondDate;
        }

        return this.sortByBestMatch(first, second);
    }

    private sortByName(
        first: TripRecommendation,
        second: TripRecommendation
    ): number {
        return first.trip.name.localeCompare(second.trip.name);
    }

    private matchesPrimaryTripFields(trip: Trip, keyword: string): boolean {
        const searchableText = [
            trip.code,
            trip.name,
            trip.resort
        ]
            .map((value) => this.toSafeString(value))
            .join(' ')
            .toLowerCase();

        return searchableText.includes(keyword);
    }

    private matchesDescription(trip: Trip, keyword: string): boolean {
        return this.toSafeString(trip.description)
            .toLowerCase()
            .includes(keyword);
    }

    private lengthMatches(
        parsedLength: number,
        minLength: number | null,
        maxLength: number | null
    ): boolean {
        if (minLength === null && maxLength === null) {
            return false;
        }

        if (parsedLength === 0) {
            return false;
        }

        if (minLength !== null && parsedLength < minLength) {
            return false;
        }

        if (maxLength !== null && parsedLength > maxLength) {
            return false;
        }

        return true;
    }

    private hasActiveCriteria(criteria: TripSearchCriteria): boolean {
        return !!(
            this.toSafeString(criteria.keyword) ||
            this.toSafeString(criteria.maxPrice) ||
            this.toSafeString(criteria.minLength) ||
            this.toSafeString(criteria.maxLength) ||
            this.toSafeString(criteria.startDate)
        );
    }

    private normalizeCriteria(criteria: TripSearchCriteria): TripSearchCriteria {
        return {
            keyword: this.toSafeString(criteria.keyword).trim(),
            maxPrice: this.toSafeString(criteria.maxPrice).trim(),
            minLength: this.toSafeString(criteria.minLength).trim(),
            maxLength: this.toSafeString(criteria.maxLength).trim(),
            startDate: this.toSafeString(criteria.startDate).trim(),
            sortBy: criteria.sortBy || DEFAULT_TRIP_SEARCH_CRITERIA.sortBy
        };
    }

    private parsePrice(priceValue: string): number {
        if (!priceValue) {
            return 0;
        }

        const cleanedPrice = this.toSafeString(priceValue)
            .replace(/,/g, '')
            .replace(/[^0-9.]/g, '');

        const parsedPrice = Number(cleanedPrice);

        return Number.isNaN(parsedPrice) ? 0 : parsedPrice;
    }

    private parseLength(lengthValue: string): number {
        if (!lengthValue) {
            return 0;
        }

        const lengthMatch = this.toSafeString(lengthValue).match(/\d+/);

        if (!lengthMatch) {
            return 0;
        }

        const parsedLength = Number(lengthMatch[0]);

        return Number.isNaN(parsedLength) ? 0 : parsedLength;
    }

    private parseSearchNumber(value: string): number | null {
        const safeValue = this.toSafeString(value)
            .replace(/,/g, '')
            .trim();

        if (!safeValue) {
            return null;
        }

        const parsedValue = Number(safeValue);

        return Number.isNaN(parsedValue) ? null : parsedValue;
    }

    private parseStartDate(dateValue: Date | string): Date | null {
        if (!dateValue) {
            return null;
        }

        const parsedDate = new Date(dateValue);

        if (Number.isNaN(parsedDate.getTime())) {
            return null;
        }

        parsedDate.setHours(0, 0, 0, 0);

        return parsedDate;
    }

    private toSafeString(value: unknown): string {
        if (value === null || value === undefined) {
            return '';
        }

        return String(value);
    }
}