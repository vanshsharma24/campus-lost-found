import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ItemCard from '../components/ItemCard';

const Items = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        category: '',
        status: ''
    });

    useEffect(() => {
        loadCategories();
        loadItems();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => loadItems(), 300);
        return () => clearTimeout(timer);
    }, [filters]);

    const loadCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const loadItems = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.type) params.type = filters.type;
            if (filters.category) params.category = filters.category;
            if (filters.status) params.status = filters.status;

            const res = await api.get('/items', { params });
            setItems(res.data);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const resetFilters = () => {
        setFilters({ search: '', type: '', category: '', status: '' });
    };

    const hasActiveFilters = filters.search || filters.type || filters.category || filters.status;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="mb-8">
                <h1 className="font-display text-4xl font-bold text-slate-900 mb-2">Browse Items</h1>
                <p className="text-slate-600">Search through all lost and found items on campus</p>
            </div>

            <div className="card p-5 mb-8">
                <div className="grid md:grid-cols-4 gap-3">
                    <div className="relative md:col-span-1">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            name="search"
                            placeholder="Search items..."
                            value={filters.search}
                            onChange={handleFilterChange}
                            className="input-field pl-10"
                        />
                    </div>
                    <select name="type" value={filters.type} onChange={handleFilterChange} className="input-field">
                        <option value="">All Types</option>
                        <option value="LOST">Lost</option>
                        <option value="FOUND">Found</option>
                    </select>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="input-field"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="input-field"
                    >
                        <option value="">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="CLAIMED">Claimed</option>
                        <option value="RETURNED">Returned</option>
                    </select>
                </div>
                {hasActiveFilters && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                        <span className="text-sm text-slate-500">
                            {items.length} {items.length === 1 ? 'result' : 'results'}
                        </span>
                        <button
                            onClick={resetFilters}
                            className="text-sm font-medium text-brand-600 hover:text-brand-700"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="card overflow-hidden animate-pulse">
                            <div className="aspect-[4/3] bg-slate-200"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 rounded"></div>
                                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="card p-16 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No items found</h3>
                    <p className="text-slate-500 mb-6">Try adjusting your filters or check back later</p>
                    {hasActiveFilters && (
                        <button onClick={resetFilters} className="btn-secondary">
                            Clear Filters
                        </button>
                    )}
                </div>
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

export default Items;
