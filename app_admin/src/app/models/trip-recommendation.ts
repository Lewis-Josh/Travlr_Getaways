import { Trip } from './trip';

export type TripSortOption =
    | 'bestMatch'
    | 'priceLowToHigh'
    | 'priceHighToLow'
    | 'startDate'
    | 'name';

export interface TripSearchCriteria {
    keyword: string;
    maxPrice: string;
    minLength: string;
    maxLength: string;
    startDate: string;
    sortBy: TripSortOption;
}

export interface TripRecommendation {
    trip: Trip;
    score: number;
    reasons: string[];
    parsedPrice: number;
    parsedLength: number;
    parsedStartDate: Date | null;
}

export interface TripSortOptionItem {
    value: TripSortOption;
    label: string;
}

export const DEFAULT_TRIP_SEARCH_CRITERIA: TripSearchCriteria = {
    keyword: '',
    maxPrice: '',
    minLength: '',
    maxLength: '',
    startDate: '',
    sortBy: 'bestMatch'
};

export const TRIP_SORT_OPTIONS: TripSortOptionItem[] = [
    {
        value: 'bestMatch',
        label: 'Best Match'
    },
    {
        value: 'priceLowToHigh',
        label: 'Price: Low to High'
    },
    {
        value: 'priceHighToLow',
        label: 'Price: High to Low'
    },
    {
        value: 'startDate',
        label: 'Start Date'
    },
    {
        value: 'name',
        label: 'Trip Name'
    }
];

export const RECOMMENDATION_SCORE_WEIGHTS = {
    keywordMatch: 40,
    priceMatch: 25,
    lengthMatch: 20,
    startDateMatch: 10,
    descriptionMatch: 5
};