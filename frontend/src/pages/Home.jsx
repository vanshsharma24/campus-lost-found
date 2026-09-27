import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import ItemCard from '../components/ItemCard';

const Home = () => {
    const [recentItems, setRecentItems] = useState([]);
    const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, returned: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await api.get('/items');
            const items = res.data;
            setRecentItems(items.slice(0, 6));
            setStats({
                total: items.length,
                lost: items.filter(i => i.type === 'LOST').length,
                found: items.filter(i => i.type === 'FOUND').length,
                returned: items.filter(i => i.status === 'RETURNED').length
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="animate-fade-in">
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-200/40 via-transparent to-transparent"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-slate-200 px-4 py-1.5 rounded-full text-sm font-medium text-slate-700 mb-6 shadow-sm">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            Trusted by students across campus
                        </div>
                        <h1 className="font-display text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                            Lost something? <br />
                            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
                                Find it here.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                            The easiest way for students and staff to report lost items and reunite with their belongings on campus.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/items" className="btn-primary text-base py-3 px-8">
                                Browse Items
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link to="/report" className="btn-secondary text-base py-3 px-8">
                                Report an Item
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Items', value: stats.total, color: 'from-brand-500 to-brand-700', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                        { label: 'Lost', value: stats.lost, color: 'from-rose-500 to-rose-700', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                        { label: 'Found', value: stats.found, color: 'from-emerald-500 to-emerald-700', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                        { label: 'Returned', value: stats.returned, color: 'from-indigo-500 to-indigo-700', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
                    ].map((stat, i) => (
                        <div key={i} className="card p-5 hover:shadow-hover transition-shadow">
                            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                </svg>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-14">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">
                        A simple three-step process to reunite items with their owners
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            step: '01',
                            title: 'Post the Item',
                            desc: 'Report a lost or found item with a photo, description, and location where it was lost or found.',
                            icon: 'M12 4v16m8-8H4'
                        },
                        {
                            step: '02',
                            title: 'Connect Instantly',
                            desc: 'Browse listings with powerful filters. Submit a claim if you find your item with proof of ownership.',
                            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                        },
                        {
                            step: '03',
                            title: 'Recover Safely',
                            desc: 'Owner reviews the claim and approves the rightful person. Meet up and mark as returned.',
                            icon: 'M5 13l4 4L19 7'
                        }
                    ].map((item, i) => (
                        <div key={i} className="card p-8 hover:shadow-hover transition-all group">
                            <div className="flex items-center justify-between mb-5">
                                <div className="w-12 h-12 bg-brand-100 group-hover:bg-brand-600 text-brand-600 group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                </div>
                                <span className="text-3xl font-display font-extrabold text-slate-200 group-hover:text-brand-100 transition-colors">
                                    {item.step}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {recentItems.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="section-title">Recent Postings</h2>
                            <p className="text-slate-600">Latest lost and found items on campus</p>
                        </div>
                        <Link to="/items" className="hidden sm:inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold text-sm">
                            View all
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentItems.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                    <div className="text-center mt-8 sm:hidden">
                        <Link to="/items" className="btn-primary">
                            View All Items
                        </Link>
                    </div>
                </section>
            )}

            <section className="bg-gradient-to-br from-brand-600 to-indigo-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                        Lost something today?
                    </h2>
                    <p className="text-lg text-brand-100 mb-8 max-w-2xl mx-auto">
                        Don't wait. Post it now and let the campus community help you find it.
                    </p>
                    <Link to="/report" className="inline-flex items-center bg-white text-brand-700 hover:bg-slate-100 px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                        Report an Item Now
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
