import { useState, useRef, useEffect } from 'react';
import { X, MapPin, Loader2, Camera, Upload, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateReportModal = ({ isOpen, onClose, onSuccess }: CreateReportModalProps) => {
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        category: 'POTHOLE',
        description: '',
        location: '',
        image_url: '',
        latitude: '',
        longitude: ''
    });

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setFormData({
                category: 'POTHOLE',
                description: '',
                location: '',
                image_url: '',
                latitude: '',
                longitude: ''
            });
            setImagePreview(null);
            setLoading(false);
            setLocationLoading(false);
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = (file: File) => {
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

                    // Update form data with coordinates
                    setFormData(prev => ({
                        ...prev,
                        latitude: lat.toString(),
                        longitude: lng.toString(),
                        // Ideally we would reverse geocode here, but for now we'll just show coords if empty
                        location: prev.location || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
                    }));
                    setLocationLoading(false);
                },
                (error) => {
                    console.error("Location error:", error);
                    alert("Could not detect location. Please check your permissions or enter manually.");
                    setLocationLoading(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setLocationLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            if (!user) {
                alert("You must be logged in to create a report.");
                setLoading(false);
                return;
            }

            // Default coordinates if missing (Safety fallback)
            const finalLat = formData.latitude ? parseFloat(formData.latitude) : 11.0168;
            const finalLng = formData.longitude ? parseFloat(formData.longitude) : 76.9558;

            const payload = {
                ...formData,
                userId: user.id || user.user_id,
                latitude: finalLat,
                longitude: finalLng,
                // Placeholder if no image provided
                image_url: formData.image_url || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400"
            };

            await axios.post('http://localhost:3000/reports', payload);

            // Success Logic
            setLoading(false);
            onSuccess();
            onClose();

        } catch (error: any) {
            console.error("Failed to create report", error);
            const errorMessage = error.response?.data?.message || error.message || "Unknown error";
            alert(`Failed to create report: ${errorMessage}`);
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">New Report</h2>
                                <p className="text-gray-400 text-sm mt-0.5">Submit an issue to the civic authorities</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-6">

                            {/* Image Upload Area */}
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative h-56 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group overflow-hidden ${dragActive
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                                    }`}
                            >
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                            <Camera size={32} className="mb-2" />
                                            <span className="font-medium">Click to change photo</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Upload size={28} />
                                        </div>
                                        <p className="text-white font-medium text-lg">Click or drag photo here</p>
                                        <p className="text-gray-400 text-sm mt-1">Supports JPEG, PNG (Max 5MB)</p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Category Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Category</label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="POTHOLE" className="bg-gray-900">🚧 Pothole</option>
                                        <option value="GARBAGE" className="bg-gray-900">🗑️ Garbage Dump</option>
                                        <option value="STREET_LIGHT" className="bg-gray-900">💡 Street Light Issue</option>
                                        <option value="WATER_LEAK" className="bg-gray-900">💧 Water Leakage</option>
                                        <option value="TRAFFIC_SIGNAL" className="bg-gray-900">🚦 Traffic Signal</option>
                                        <option value="OTHER" className="bg-gray-900">❓ Other Issue</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Please describe the issue in detail..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all resize-none"
                                />
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Location</label>
                                    {formData.latitude && (
                                        <span className="text-xs text-green-400 flex items-center">
                                            <CheckCircle2 size={12} className="mr-1" /> Coordinates locked
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="Enter address or landmark"
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleLocation}
                                        disabled={locationLoading}
                                        className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl transition-all flex items-center justify-center min-w-[50px]"
                                        title="Auto-detect Location"
                                    >
                                        {locationLoading ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
                                    </button>
                                </div>
                                {formData.latitude && (
                                    <div className="text-xs text-gray-500 font-mono pl-1">
                                        GPS: {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-white font-medium transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin mr-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Report'
                                    )}
                                </button>
                            </div>

                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreateReportModal;
