const db = require('../config/db');

const createItem = async (req, res) => {
    try {
        const { title, description, category_id, type, location, date } = req.body;
        const image = req.file ? req.file.path : null;

        if (!title || !description || !type || !location || !date) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const [result] = await db.query(
            'INSERT INTO items (user_id, title, description, category_id, type, location, date, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, title, description, category_id || null, type, location, date, image]
        );

        res.status(201).json({ message: 'Item posted successfully', itemId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getAllItems = async (req, res) => {
    try {
        const { type, category, status, search } = req.query;

        let query = `
            SELECT items.*, users.name as user_name, categories.name as category_name
            FROM items
            LEFT JOIN users ON items.user_id = users.id
            LEFT JOIN categories ON items.category_id = categories.id
            WHERE 1=1
        `;
        const params = [];

        if (type) {
            query += ' AND items.type = ?';
            params.push(type);
        }

        if (category) {
            query += ' AND items.category_id = ?';
            params.push(category);
        }

        if (status) {
            query += ' AND items.status = ?';
            params.push(status);
        }

        if (search) {
            query += ' AND (items.title LIKE ? OR items.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY items.created_at DESC';

        const [items] = await db.query(query, params);
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getItemById = async (req, res) => {
    try {
        const [items] = await db.query(
            `SELECT items.*, users.name as user_name, users.email as user_email, users.phone as user_phone, categories.name as category_name
             FROM items
             LEFT JOIN users ON items.user_id = users.id
             LEFT JOIN categories ON items.category_id = categories.id
             WHERE items.id = ?`,
            [req.params.id]
        );

        if (items.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(items[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const { title, description, category_id, location, date, status } = req.body;

        const [items] = await db.query('SELECT * FROM items WHERE id = ?', [req.params.id]);

        if (items.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (items[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this item' });
        }

        const image = req.file ? req.file.path : items[0].image;

        await db.query(
            'UPDATE items SET title = ?, description = ?, category_id = ?, location = ?, date = ?, image = ?, status = ? WHERE id = ?',
            [
                title || items[0].title,
                description || items[0].description,
                category_id || items[0].category_id,
                location || items[0].location,
                date || items[0].date,
                image,
                status || items[0].status,
                req.params.id
            ]
        );

        res.json({ message: 'Item updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const [items] = await db.query('SELECT * FROM items WHERE id = ?', [req.params.id]);

        if (items.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (items[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this item' });
        }

        await db.query('DELETE FROM items WHERE id = ?', [req.params.id]);

        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getMyItems = async (req, res) => {
    try {
        const { type } = req.query;
        let query = `
            SELECT items.*, categories.name as category_name
            FROM items
            LEFT JOIN categories ON items.category_id = categories.id
            WHERE items.user_id = ?
        `;
        const params = [req.user.id];

        if (type) {
            query += ' AND items.type = ?';
            params.push(type);
        }

        query += ' ORDER BY items.created_at DESC';

        const [items] = await db.query(query, params);
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const markReturned = async (req, res) => {
    try {
        const [items] = await db.query('SELECT * FROM items WHERE id = ?', [req.params.id]);

        if (items.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (items[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await db.query('UPDATE items SET status = ? WHERE id = ?', ['RETURNED', req.params.id]);
        res.json({ message: 'Item marked as returned' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { createItem, getAllItems, getItemById, updateItem, deleteItem, getMyItems, markReturned };
