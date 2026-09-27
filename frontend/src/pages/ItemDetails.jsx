import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { getImageUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showClaimForm, setShowClaimForm] = useState(false);
    const [claimDesc, setClaimDesc] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadItem();
    }, [id]);

    const loadItem = async () => {
        try {
            const res = await api.get(`/items/${id}`);
            setItem(res.data);
        } catch (err) {
            toast.error('Item not found');
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/items/${id}`);
            toast.success('Item deleted');
            navigate('/items');
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const handleMarkReturned = async () => {
        try {
            await api.patch(`/items/${id}/return`);
            toast.success('Marked as returned');
            loadItem();
        } catch (err) {
            toast.error('Failed to update');
        }
    };

    const handleClaimSubmit = async (e) => {
        e.preventDefault();
        if (!claimDesc.trim()) {
            toast.error('Please provide claim details');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/claims', { item_id: id, description: claimDesc });
            toast.success('Claim submitted');
            setShowClaimForm(false);
            setClaimDesc('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit claim');
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="card overflow-hidden animate-pulse">
                    <div className="grid md:grid-cols-2">
                        <div className="aspect-square bg-slate-200"></div>
                        <div className="p-8 space-y-4">
                            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 rounded"></div>
                            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="max-w-md mx-auto py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Item not found</h2>
                <p className="text-slate-600 mb-6">This item may have been removed.</p>
                <Link to="/items" className="btn-primary">Browse Items</Link>
            </div>
        );
    }

    const imageUrl = getImageUrl(item.image) || 'https://via.placeholder.com/600x600?text=No+Image';
    const isOwner = user && user.id === item.user_id;

    const typeStyles = item.type === 'LOST'
        ? 'bg-rose-100 text-rose-700 border border-rose-200'
        : 'bg-emerald-100 text-emerald-700 border border-emerald-200';

    const statusStyles = {
        OPEN: 'bg-amber-100 text-amber-700 border border-amber-200',
        CLAIMED: 'bg-blue-100 text-blue-700 border border-blue-200',
        RETURNED: 'bg-slate-100 text-slate-600 border border-slate-200'
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <Link to="/items" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Items
            </Link>

            <div className="card overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative aspect-square md:aspect-auto bg-slate-100">
                        <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className={`badge ${typeStyles}`}>{item.type}</span>
                            <span className={`badge ${statusStyles[item.status]}`}>{item.status}</span>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col">
                        <h1 className="font-display text-3xl font-bold text-slate-900 mb-3">{item.title}</h1>
                        <p className="text-slate-600 leading-relaxed mb-6">{item.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6 py-6 border-y border-slate-100">
                            <div>
                                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Category</div>
                                <div className="text-slate-900 font-medium">{item.category_name || 'Uncategorized'}</div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Date</div>
                                <div className="text-slate-900 font-medium">
                                    {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Location</div>
                                <div className="text-slate-900 font-medium flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {item.location}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white font-semibold">
                                {item.user_name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-900">{item.user_name}</div>
                                <div className="text-xs text-slate-500">Posted by</div>
                            </div>
                        </div>

                        {user && !isOwner && (
                            <div className="bg-slate-50 rounded-xl p-4 mb-6">
                                <h3 className="text-sm font-semibold text-slate-900 mb-2">Contact Information</h3>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <a href={`mailto:${item.user_email}`} className="hover:text-brand-600">{item.user_email}</a>
                                    </div>
                                    {item.user_phone && (
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <a href={`tel:${item.user_phone}`} className="hover:text-brand-600">{item.user_phone}</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-auto flex flex-wrap gap-2">
                            {isOwner ? (
                                <>
                                    <button onClick={() => navigate(`/edit/${id}`)} className="btn-secondary flex-1">
                                        Edit
                                    </button>
                                    {item.status !== 'RETURNED' && (
                                        <button onClick={handleMarkReturned} className="flex-1 inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all">
                                            Mark as Returned
                                        </button>
                                    )}
                                    <button onClick={handleDelete} className="btn-danger">
                                        Delete
                                    </button>
                                </>
                            ) : (
                                user && item.status === 'OPEN' && (
                                    <button
                                        onClick={() => setShowClaimForm(!showClaimForm)}
                                        className="btn-primary w-full py-3"
                                    >
                                        {showClaimForm ? 'Cancel' : 'Submit a Claim'}
                                    </button>
                                )
                            )}
                            {!user && (
                                <Link to="/login" className="btn-primary w-full py-3">
                                    Sign in to submit a claim
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {showClaimForm && (
                    <div className="border-t border-slate-100 p-6 md:p-8 bg-slate-50">
                        <form onSubmit={handleClaimSubmit}>
                            <h4 className="font-semibold text-slate-900 mb-2">Verify Ownership</h4>
                            <p className="text-sm text-slate-600 mb-4">
                                Provide unique details that only the real owner would know — brand, distinctive features, contents, or when you lost it.
                            </p>
                            <textarea
                                value={claimDesc}
                                onChange={(e) => setClaimDesc(e.target.value)}
                                placeholder="e.g. Brown leather wallet, has my student ID with roll number 2023CS15, around ₹500 cash inside..."
                                className="input-field resize-none"
                                rows={4}
                                required
                            />
                            <div className="flex gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowClaimForm(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary flex-1 disabled:opacity-60"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Claim'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemDetails;
