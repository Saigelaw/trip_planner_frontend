export interface TripInputs {
    current_location: string;
    pickup_location: string;
    dropoff_location: string;
    current_cycle_used_hrs: number;
}

export interface TripLogEvent {
    type: string;
    start_time: string;
    duration: number; // in hours
}

export interface TripLogSheet {
    date: string;
    events: TripLogEvent[];
}

export interface RouteData {
    distance: number; // in meters
    duration: number; // in seconds
    geometry: number[][]; // array of [lon, lat] pairs
    legs: { duration: number, distance: number }[];
}

export interface TripData {
    id: number;
    current_location: string;
    pickup_location: string;
    dropoff_location: string;
    current_cycle_used_hrs: number;
    route_data: RouteData;
    eld_logs_data: TripLogSheet[];
    created_at: string;
}