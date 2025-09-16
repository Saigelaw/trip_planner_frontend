import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import type { RouteData } from '../types';

// Fix for default Leaflet icon not showing up
// You might need to adjust the path based on your project structure

L.Icon.Default.mergeOptions({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: shadow,
});

interface MapProps {
    routeData: RouteData;
}

const Map = ({ routeData }: MapProps) => {
    if (!routeData || !routeData.geometry || routeData.geometry.length === 0) {
        return <p className="text-gray-500 text-center">No route data to display.</p>;
    }

    // Openrouteservice returns coordinates in [lon, lat] format.
    // Leaflet expects [lat, lon]. We must reverse them.
    const path = routeData.geometry.map(coord => [coord[1], coord[0]] as L.LatLngTuple);
    const startPoint = path[0];
    const endPoint = path[path.length - 1];

    const formatDistance = (m: number) => (m / 1609.34).toFixed(2); // meters to miles
    const formatDuration = (s: number) => (s / 3600).toFixed(2); // seconds to hours

    return (
        <div className="h-96 w-full rounded-md overflow-hidden shadow-inner">
            <MapContainer
                center={startPoint}
                zoom={6}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline pathOptions={{ color: 'blue' }} positions={path} />

                <Marker position={startPoint}>
                    <Popup>Start Location</Popup>
                </Marker>

                <Marker position={endPoint}>
                    <Popup>End Location</Popup>
                </Marker>
            </MapContainer>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-700">
                    Total Distance: <span className="font-bold">{formatDistance(routeData.distance)} mi</span>
                </p>
                <p className="text-sm text-gray-700">
                    Total Driving Time: <span className="font-bold">{formatDuration(routeData.duration)} hrs</span>
                </p>
            </div>
        </div>
    );
};

export default Map;