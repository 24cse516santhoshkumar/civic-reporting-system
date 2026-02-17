import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for default marker icon in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const DashboardMap = () => {
    const [heatmapData, setHeatmapData] = useState<[number, number][]>([]);

    useEffect(() => {
        const fetchHeatmapData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/analytics/heatmap`);
                // Ensure data is in correct format [lat, lng]
                setHeatmapData(res.data);
            } catch (error) {
                console.error("Failed to fetch map data", error);
            }
        };

        fetchHeatmapData();
    }, []);

    // Placeholder data if API returns empty (for demo)
    const displayData = heatmapData.length > 0 ? heatmapData : [
        [12.9716, 77.5946], // Bangalore
        [12.9800, 77.6000],
        [12.9600, 77.5800],
        [12.9700, 77.6100],
        [12.9500, 77.5700]
    ];

    return (
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-lg mb-8 h-[400px] relative z-0">
            <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-4">Live Incident Map</h3>
            <div className="h-[320px] rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
                <MapContainer center={[12.9716, 77.5946]} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        className="map-tiles"
                    />
                    {displayData.map((pos, idx) => (
                        <Marker key={idx} position={pos as [number, number]}>
                            <Popup>
                                Reported Issue #{idx + 1}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default DashboardMap;
