import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader2, Camera, Upload, CheckCircle2, ArrowLeft, AlertTriangle, Search } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const CreateReport = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get user safely
    const [user] = useState<any>(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            return null;
        }
    });

    const [formData, setFormData] = useState({
        category: 'POTHOLE',
        description: '',
        location: '',
        image_url: '',
        latitude: '',
        longitude: ''
    });

    const categories = [
        { id: 'POTHOLE', label: 'Pothole', icon: '🚧' },
        { id: 'GARBAGE', label: 'Garbage Dump', icon: '🗑️' },
        { id: 'STREET_LIGHT', label: 'Street Light', icon: '💡' },
        { id: 'WATER_LEAK', label: 'Water Leak', icon: '💧' },
        { id: 'TRAFFIC_SIGNAL', label: 'Traffic Signal', icon: '🚦' },
        { id: 'OTHER', label: 'Other Issue', icon: '❓' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategorySelect = (categoryId: string) => {
        setFormData(prev => ({ ...prev, category: categoryId }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            alert("File is too large. Max 5MB allowed.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setImagePreview(base64String);
            setFormData(prev => ({ ...prev, image_url: base64String }));
        };
        reader.readAsDataURL(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setFormData(prev => ({
                        ...prev,
                        latitude: lat.toString(),
                        longitude: lng.toString(),
                        location: prev.location || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
                    }));
                    setLocationLoading(false);
                },
                (error) => {
                    console.error("Location error:", error);
                    alert("Could not detect location. Please check permissions.");
                    setLocationLoading(false);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setLocationLoading(false);
        }
    };

    const handleGeocode = async () => {
        if (!formData.location) return;
        setLocationLoading(true);
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}`);
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setFormData(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lon
                }));
            } else {
                alert("Location not found. Please try a more specific address.");
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            alert("Failed to find location.");
        } finally {
            setLocationLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) {
                alert("You must be logged in to create a report.");
                setLoading(false);
                return;
            }

            if (!formData.latitude || !formData.longitude) {
                alert("Please add a location to your report.");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                userId: user.id || user.user_id,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                image_url: formData.image_url || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400"
            };

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports`, payload);
            setLoading(false);
            navigate('/dashboard');

        } catch (error: any) {
            console.error("Failed to create report", error);
            const errorMessage = error.response?.data?.message || "Something went wrong";
            alert(`Failed to create report: ${errorMessage}`);
            setLoading(false);
        }
    };

    return (
        <Layout userRole={user?.role}>
            <div className="max-w-4xl mx-auto pb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center p-6 border-b border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-md sticky top-0 z-20">
                        <button
                            onClick={() => navigate(-1)}
                            className="mr-4 p-2 rounded-full hover:bg-white/20 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold dark:text-white text-gray-900 tracking-tight">Create New Report</h2>
                            <p className="dark:text-gray-400 text-gray-600 text-sm mt-0.5">Help us improve the city by reporting an issue</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                        {/* Left Column: Image & Location */}
                        <div className="lg:col-span-2 p-6 bg-white/10 dark:bg-black/20 border-b lg:border-b-0 lg:border-r border-white/20">
                            {/* Image Upload Area */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-2">Evidence Photo</label>
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group overflow-hidden ${dragActive
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-white/40 dark:border-white/20 bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                                <Camera size={32} className="mb-2" />
                                                <span className="font-medium">Change Photo</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-6 transform group-hover:scale-105 transition-transform">
                                            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-3 shadow-inner">
                                                <Upload size={28} />
                                            </div>
                                            <p className="dark:text-white text-gray-900 font-semibold">Upload Photo</p>
                                            <p className="dark:text-gray-400 text-gray-600 text-xs mt-1">Drag & drop or click</p>
                                        </div>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </div>
                            </div>

                            {/* Location Status */}
                            <div>
                                <label className="block text-sm font-bold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-2">Location Status</label>
                                <div className={`p-4 rounded-xl border ${formData.latitude ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                    <div className="flex items-center gap-3">
                                        {formData.latitude ? (
                                            <CheckCircle2 className="text-green-500" size={24} />
                                        ) : (
                                            <AlertTriangle className="text-red-400" size={24} />
                                        )}
                                        <div>
                                            <p className={`font-bold ${formData.latitude ? 'text-green-500' : 'text-red-400'}`}>
                                                {formData.latitude ? 'Location Locked' : 'Location Required'}
                                            </p>
                                            <p className="text-xs dark:text-gray-400 text-gray-600">
                                                {formData.latitude
                                                    ? `${parseFloat(formData.latitude).toFixed(4)}, ${parseFloat(formData.longitude).toFixed(4)}`
                                                    : 'Please detect or enter location'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form Fields */}
                        <form onSubmit={handleSubmit} className="lg:col-span-3 p-6 lg:p-8 space-y-6 flex flex-col h-full">

                            {/* Category Selection Grid */}
                            <div>
                                <label className="block text-sm font-bold dark:text-gray-300 text-gray-700 uppercase tracking-wider mb-3">Issue Category</label>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => handleCategorySelect(cat.id)}
                                            className={`p-3 rounded-xl border text-left transition-all ${formData.category === cat.id
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30'
                                                : 'bg-white/20 dark:bg-white/5 border-white/40 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 dark:text-gray-300 text-gray-700'
                                                }`}
                                        >
                                            <span className="text-xl mb-1 block">{cat.icon}</span>
                                            <span className="text-sm font-bold">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold dark:text-gray-300 text-gray-700 uppercase tracking-wider">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Describe the issue..."
                                    className="w-full px-5 py-3 bg-white/20 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl dark:text-white text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none shadow-inner"
                                />
                            </div>

                            {/* Location Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold dark:text-gray-300 text-gray-700 uppercase tracking-wider">Address / Landmark</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            onBlur={() => { if (formData.location && !formData.latitude) handleGeocode() }}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleGeocode(); } }}
                                            placeholder="Enter address"
                                            className="w-full pl-10 pr-12 py-3 bg-white/20 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl dark:text-white text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGeocode}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 p-1"
                                            title="Search for address"
                                        >
                                            <Search size={18} />
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleLocation}
                                        disabled={locationLoading}
                                        className="px-4 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-2xl transition-all flex items-center justify-center min-w-[50px] shadow-sm hover:shadow-md"
                                        title="Auto-detect Location (GPS)"
                                    >
                                        {locationLoading ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 ml-1">Type address and press Enter to auto-fill coordinates</p>
                            </div>

                            <div className="flex-1"></div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-lg shadow-xl shadow-blue-500/30 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? <Loader2 size={24} className="animate-spin mr-2" /> : <CheckCircle2 size={24} className="mr-2" />}
                                {loading ? 'Submitting Report...' : 'Submit Report'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default CreateReport;
