const bcrypt = require('bcryptjs');
const db = require('./config/db');
require('dotenv').config();

const dummyUsers = [
    { name: 'Priya Sharma', email: 'priya@college.edu', password: 'test1234', phone: '9876543210' },
    { name: 'Ravi Kumar', email: 'ravi@college.edu', password: 'test1234', phone: '9876543211' },
    { name: 'Ananya Singh', email: 'ananya@college.edu', password: 'test1234', phone: '9876543212' },
    { name: 'Arjun Patel', email: 'arjun@college.edu', password: 'test1234', phone: '9876543213' },
    { name: 'Sneha Gupta', email: 'sneha@college.edu', password: 'test1234', phone: '9876543214' }
];

const dummyItems = [
    {
        title: 'Black Leather Wallet',
        description: 'Small black leather wallet with student ID card and around Rs 500 inside. Lost near library.',
        category_id: 7,
        type: 'LOST',
        location: 'Central Library, 2nd Floor',
        date: '2026-09-20',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'
    },
    {
        title: 'iPhone 13 Pro',
        description: 'Blue color iPhone 13 Pro with a clear case. Screen has a small crack on the top right corner.',
        category_id: 1,
        type: 'LOST',
        location: 'Cafeteria, Table near window',
        date: '2026-09-22',
        image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500'
    },
    {
        title: 'Brown Backpack',
        description: 'Brown Wildcraft backpack with laptop and books inside. Has a keychain with a small bear.',
        category_id: 3,
        type: 'LOST',
        location: 'Lecture Hall 3, Block B',
        date: '2026-09-24',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
    },
    {
        title: 'Silver Watch (Titan)',
        description: 'Silver Titan analog watch with black leather strap. Family gift, very important.',
        category_id: 7,
        type: 'LOST',
        location: 'Sports Ground, near basketball court',
        date: '2026-09-25',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500'
    },
    {
        title: 'DBMS Textbook (Korth)',
        description: 'Database System Concepts by Korth, 7th edition. Has my name written on the first page.',
        category_id: 2,
        type: 'LOST',
        location: 'Computer Lab 2',
        date: '2026-09-26',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'
    },
    {
        title: 'Set of Keys with Red Keychain',
        description: 'Bunch of 3 keys with a red car-shaped keychain. Found near main gate.',
        category_id: 5,
        type: 'FOUND',
        location: 'Main Gate, Security Desk',
        date: '2026-09-23',
        image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500'
    },
    {
        title: 'Blue Water Bottle',
        description: 'Milton blue steel water bottle. Found on a bench outside the auditorium.',
        category_id: 9,
        type: 'FOUND',
        location: 'Outside Auditorium',
        date: '2026-09-24',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'
    },
    {
        title: 'Student ID Card',
        description: 'ID Card of a student from CSE branch, 2023 batch. Name starts with A. Found in canteen.',
        category_id: 4,
        type: 'FOUND',
        location: 'Canteen',
        date: '2026-09-25',
        image: 'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=500'
    },
    {
        title: 'Black Wireless Earbuds',
        description: 'Boat Airdopes 141 earbuds with charging case. Found in library.',
        category_id: 1,
        type: 'FOUND',
        location: 'Library Reading Hall',
        date: '2026-09-26',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'
    },
    {
        title: 'Grey Hoodie',
        description: 'Grey Nike hoodie, size M. Found on a chair in Lecture Hall 5.',
        category_id: 6,
        type: 'FOUND',
        location: 'Lecture Hall 5',
        date: '2026-09-27',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'
    },
    {
        title: 'Calculator (Casio fx-991)',
        description: 'Casio fx-991EX scientific calculator. Found in maths lab.',
        category_id: 1,
        type: 'FOUND',
        location: 'Maths Lab',
        date: '2026-09-26',
        image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500'
    },
    {
        title: 'Aadhar Card',
        description: 'Aadhar card found near parking area. Please contact to verify identity.',
        category_id: 8,
        type: 'FOUND',
        location: 'Parking Area, Block C',
        date: '2026-09-27',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500'
    }
];

async function seed() {
    try {
        console.log('Starting seed...');

        const userIds = [];
        for (const user of dummyUsers) {
            const hashed = await bcrypt.hash(user.password, 10);
            const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [user.email]);
            if (existing.length > 0) {
                console.log(`User already exists: ${user.email}`);
                userIds.push(existing[0].id);
                continue;
            }
            const [result] = await db.query(
                'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
                [user.name, user.email, hashed, user.phone]
            );
            console.log(`Created user: ${user.email} (id=${result.insertId})`);
            userIds.push(result.insertId);
        }

        for (let i = 0; i < dummyItems.length; i++) {
            const item = dummyItems[i];
            const userId = userIds[i % userIds.length];
            await db.query(
                `INSERT INTO items (user_id, title, description, category_id, type, location, date, image, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
                [userId, item.title, item.description, item.category_id, item.type, item.location, item.date, item.image]
            );
            console.log(`Created item: ${item.title}`);
        }

        console.log('\nSeed complete!');
        console.log(`Users: ${dummyUsers.length}, Items: ${dummyItems.length}`);
        console.log('\nLogin with any dummy user:');
        console.log('  Email:    priya@college.edu (or ravi/ananya/arjun/sneha)');
        console.log('  Password: test1234');
        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
