import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import type { TripInputs, TripData } from '../types';
import { useState } from 'react';

interface TripFormProps {
    onTripResult: (data: TripData) => void;
    onLoading?: () => void;
    onError?: (message: string) => void;
}

const TripForm = ({ onTripResult }: TripFormProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TripInputs>();
    const [error, setError] = useState<string | null>(null);

    const onSubmit: SubmitHandler<TripInputs> = async (data) => {
        setError(null);
        try {
            // Convert current_cycle_used_hrs to a number before sending
            const payload = {
                ...data,
                current_cycle_used_hrs: parseFloat(String(data.current_cycle_used_hrs)),
            };

            const response = await axios.post<TripData>(
                'https://tripplannerbackend-production.up.railway.app/api/trips/v1/trip_plan/',
                payload
            );
            onTripResult(response.data);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.error || 'Failed to get trip plan.');
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col">
                <label htmlFor="current_location" className="text-sm font-medium text-gray-700">
                    Current Location
                </label>
                <input
                    id="current_location"
                    type="text"
                    className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    {...register('current_location', { required: 'Current location is required' })}
                />
                {errors.current_location && (
                    <p className="mt-1 text-xs text-red-500">{errors.current_location.message}</p>
                )}
            </div>

            <div className="flex flex-col">
                <label htmlFor="pickup_location" className="text-sm font-medium text-gray-700">
                    Pickup Location
                </label>
                <input
                    id="pickup_location"
                    type="text"
                    className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    {...register('pickup_location', { required: 'Pickup location is required' })}
                />
                {errors.pickup_location && (
                    <p className="mt-1 text-xs text-red-500">{errors.pickup_location.message}</p>
                )}
            </div>

            <div className="flex flex-col">
                <label htmlFor="dropoff_location" className="text-sm font-medium text-gray-700">
                    Dropoff Location
                </label>
                <input
                    id="dropoff_location"
                    type="text"
                    className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    {...register('dropoff_location', { required: 'Dropoff location is required' })}
                />
                {errors.dropoff_location && (
                    <p className="mt-1 text-xs text-red-500">{errors.dropoff_location.message}</p>
                )}
            </div>

            <div className="flex flex-col">
                <label htmlFor="current_cycle_used_hrs" className="text-sm font-medium text-gray-700">
                    Current Cycle Used Hours
                </label>
                <input
                    id="current_cycle_used_hrs"
                    type="number"
                    step="0.01"
                    className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    {...register('current_cycle_used_hrs', {
                        required: 'Used hours are required',
                        valueAsNumber: true,
                        min: { value: 0, message: 'Hours must be a positive number' }
                    })}
                />
                {errors.current_cycle_used_hrs && (
                    <p className="mt-1 text-xs text-red-500">{errors.current_cycle_used_hrs.message}</p>
                )}
            </div>

            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Planning Trip...' : 'Plan Trip'}
            </button>
        </form>
    );
};

export default TripForm;