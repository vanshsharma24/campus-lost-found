import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [joinDate, setJoinDate] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await api.get('/auth/profile');
            setFormData({
                name: res.data.name,
                phone: res.data.phone || ''
            });
            setJoinDate(res.data.created_at);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/auth/profile', formData);
            updateUser(res.data.user);
            toast.success('Profile updated');
        } catch (err) {
            toast.error('Update failed');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="mb-8">
                <h1 className="font-display text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
                <p className="text-slate-600">Manage your personal information</p>
            </div>

            <div className="card p-8 mb-6">
                <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-100">
                    <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="font-display text-2xl font-bold text-slate-900">{user?.name}</h2>
                        <p className="text-slate-500 text-sm">{user?.email}</p>
                        {joinDate && (
                            <p className="text-slate-400 text-xs mt-1">
                                Joined {new Date(joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                            </p>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="input-field bg-slate-50 text-slate-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-500 mt-1.5">Email cannot be changed</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="10-digit mobile number"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
