import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('lost');
    const [items, setItems] = useState([]);
    const [claims, setClaims] = useState([]);
    const [receivedClaims, setReceivedClaims] = useState([]);
    const [loading, setLoading] = useState(false);
    const [counts, setCounts] = useState({ lost: 0, found: 0, myClaims: 0, received: 0, returned: 0 });

    useEffect(() => {
        loadData();
        loadCounts();
    }, [activeTab]);

    const loadCounts = async () => {
        try {
            const [itemsRes, myClaimsRes, receivedRes] = await Promise.all([
                api.get('/items/my/items'),
                api.get('/claims/my'),
                api.get('/claims/received')
            ]);
            setCounts({
                lost: itemsRes.data.filter(i => i.type === 'LOST').length,
                found: itemsRes.data.filter(i => i.type === 'FOUND').length,
                myClaims: myClaimsRes.data.length,
                received: receivedRes.data.filter(c => c.status === 'PENDING').length,
                returned: itemsRes.data.filter(i => i.status === 'RETURNED').length
            });
        } catch (err) {
            console.log(err);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'lost') {
                const res = await api.get('/items/my/items?type=LOST');
                setItems(res.data);
            } else if (activeTab === 'found') {
                const res = await api.get('/items/my/items?type=FOUND');
                setItems(res.data);
            } else if (activeTab === 'returned') {
                const res = await api.get('/items/my/items');
                setItems(res.data.filter((i) => i.status === 'RETURNED'));
            } else if (activeTab === 'my-claims') {
                const res = await api.get('/claims/my');
                setClaims(res.data);
            } else if (activeTab === 'received') {
                const res = await api.get('/claims/received');
                setReceivedClaims(res.data);
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    const handleClaimAction = async (claimId, status) => {
        try {
            await api.patch(`/claims/${claimId}/status`, { status });
            toast.success(`Claim ${status.toLowerCase()}`);
            loadData();
            loadCounts();
        } catch (err) {
            toast.error('Failed to update claim');
        }
    };

    const tabs = [
        { key: 'lost', label: 'Lost Items', count: counts.lost, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { key: 'found', label: 'Found Items', count: counts.found, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { key: 'my-claims', label: 'My Claims', count: counts.myClaims, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { key: 'received', label: 'Received Claims', count: counts.received, icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
        { key: 'returned', label: 'Returned', count: counts.returned, icon: 'M5 13l4 4L19 7' }
    ];

    const statusStyles = {
        PENDING: 'bg-amber-100 text-amber-700 border border-amber-200',
        APPROVED: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        REJECTED: 'bg-rose-100 text-rose-700 border border-rose-200'
    };

    const renderEmpty = (message, cta) => (
        <div className="card p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Nothing here yet</h3>
            <p className="text-slate-500 mb-6">{message}</p>
            {cta}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display text-4xl font-bold text-slate-900 mb-1">
                        Welcome back, {user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-slate-600">Manage your items and claims from one place</p>
                </div>
                <Link to="/report" className="btn-primary">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Report New Item
                </Link>
            </div>

            <div className="card p-1 mb-8">
                <div className="flex flex-wrap gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab.key
                                    ? 'bg-brand-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                            </svg>
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    activeTab === tab.key
                                        ? 'bg-white/20 text-white'
                                        : 'bg-slate-200 text-slate-700'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="card overflow-hidden animate-pulse">
                            <div className="aspect-[4/3] bg-slate-200"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : activeTab === 'my-claims' ? (
                claims.length === 0 ? renderEmpty(
                    'You haven\'t claimed any items yet.',
                    <Link to="/items" className="btn-primary">Browse Items</Link>
                ) : (
                    <div className="space-y-4">
                        {claims.map((claim) => (
                            <div key={claim.id} className="card p-5 hover:shadow-hover transition-shadow">
                                <div className="flex gap-4">
                                    {claim.item_image && (
                                        <img
                                            src={getImageUrl(claim.item_image)}
                                            alt={claim.item_title}
                                            className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-3 mb-2">
                                            <h3 className="font-bold text-lg text-slate-900">{claim.item_title}</h3>
                                            <span className={`badge ${statusStyles[claim.status]}`}>
                                                {claim.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-3 leading-relaxed">{claim.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">
                                                Submitted {new Date(claim.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                            <Link
                                                to={`/items/${claim.item_id}`}
                                                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                                            >
                                                View Item →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : activeTab === 'received' ? (
                receivedClaims.length === 0 ? renderEmpty(
                    'No one has claimed your items yet.',
                    null
                ) : (
                    <div className="space-y-4">
                        {receivedClaims.map((claim) => (
                            <div key={claim.id} className="card p-5 hover:shadow-hover transition-shadow">
                                <div className="flex gap-4">
                                    {claim.item_image && (
                                        <img
                                            src={getImageUrl(claim.item_image)}
                                            alt={claim.item_title}
                                            className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-3 mb-3">
                                            <h3 className="font-bold text-lg text-slate-900">{claim.item_title}</h3>
                                            <span className={`badge ${statusStyles[claim.status]}`}>
                                                {claim.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                                            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                {claim.claimer_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{claim.claimer_name}</div>
                                                <div className="text-xs text-slate-500">
                                                    {claim.claimer_email}
                                                    {claim.claimer_phone && ` · ${claim.claimer_phone}`}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-700 mb-4 leading-relaxed bg-slate-50 rounded-lg p-3">
                                            "{claim.description}"
                                        </p>
                                        {claim.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleClaimAction(claim.id, 'APPROVED')}
                                                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleClaimAction(claim.id, 'REJECTED')}
                                                    className="flex items-center gap-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : items.length === 0 ? (
                renderEmpty(
                    'You haven\'t posted any items in this category.',
                    <Link to="/report" className="btn-primary">Report an Item</Link>
                )
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
