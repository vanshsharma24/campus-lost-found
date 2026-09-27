import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import ItemCard from '../components/ItemCard';

const Home = () => {
    const [recentItems, setRecentItems] = useState([]);

    useEffect(() => {
        loadRecentItems();
    }, []);

    const loadRecentItems = async () => {
        try {
            const res = await api.get('/items');
            setRecentItems(res.data.slice(0, 6));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Lost Something on Campus?
                    </h1>
                    <p className="text-lg mb-8 text-blue-100">
                        Report and find lost items easily. Help others reunite with their belongings.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/items"
                            className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded font-semibold"
                        >
                            Browse Items
                        </Link>
                        <Link
                            to="/report"
                            className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded font-semibold"
                        >
                            Report an Item
                        </Link>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-3">1</div>
                        <h3 className="font-semibold mb-2">Post the Item</h3>
                        <p className="text-gray-600 text-sm">Report a lost or found item with details and photo.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-3">2</div>
                        <h3 className="font-semibold mb-2">Connect</h3>
                        <p className="text-gray-600 text-sm">Search listings and submit a claim if you find your item.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-3">3</div>
                        <h3 className="font-semibold mb-2">Recover</h3>
                        <p className="text-gray-600 text-sm">Verify ownership and mark the item as returned.</p>
                    </div>
                </div>
            </section>

            {recentItems.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Postings</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentItems.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <Link to="/items" className="text-blue-600 hover:underline font-medium">
                            View All Items →
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
