import { useState } from 'react';
import TripForm from './components/TripForm';
import Map from './components/Map';
import EldLog from './components/EldLog';
import type { TripData } from './types';

const App = () => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTripResult = (data: TripData) => {
    setTripData(data);
    setIsLoading(false);
    setError(null);
  };

  const handleLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleError = (message: string) => {
    setIsLoading(false);
    setError(message);
    setTripData(null);
  };

  // Function to convert seconds to a more readable format (e.g., "5 hours, 30 minutes")
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''}, ${minutes} min${minutes > 1 ? 's' : ''}`;
    }
    return `${minutes} min${minutes > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Truck Trip Planner
        </h1>

        <TripForm
          onTripResult={handleTripResult}
          onLoading={handleLoading}
          onError={handleError}
        />

        {isLoading && (
          <div className="mt-8 text-center text-lg font-medium text-indigo-600">
            Calculating route and logs...
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {tripData && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Map routeData={tripData.route_data} />

              {/* === BEGIN: STYLED TRIP DATA OUTPUT === */}
              <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trip Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Pickup</p>
                    <p className="font-medium text-gray-900">{tripData.pickup_location}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Dropoff</p>
                    <p className="font-medium text-gray-900">{tripData.dropoff_location}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Distance</p>
                    <p className="font-medium text-gray-900">{(tripData.route_data.distance / 1609.34).toFixed(1)} miles</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Estimated Duration</p>
                    <p className="font-medium text-gray-900">{formatDuration(tripData.route_data.duration)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">HOS Cycle Used</p>
                    <p className="font-medium text-gray-900">{tripData.current_cycle_used_hrs} hrs</p>
                  </div>
                </div>
              </div>
              {/* === END: STYLED TRIP DATA OUTPUT === */}
            </div>

            <EldLog logSheets={tripData.eld_logs_data} />

          </div>
        )}
      </div>
    </div>
  );
};

export default App;