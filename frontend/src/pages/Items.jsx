import { useEffect, useState } from 'react';
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

    const handleSearch = (e) => {
        e.preventDefault();
        loadItems();
    };

    const resetFilters = () => {
        setFilters({ search: '', type: '', category: '', status: '' });
        setTimeout(() => loadItems(), 0);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse Items</h1>

            <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by title..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="input-field"
                    />
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
                <div className="flex gap-3">
                    <button type="submit" className="btn-primary">Apply Filters</button>
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    >
                        Reset
                    </button>
                </div>
            </form>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : items.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No items found</div>
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
