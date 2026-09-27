const db = require('../config/db');

const createClaim = async (req, res) => {
    try {
        const { item_id, description } = req.body;

        if (!item_id || !description) {
            return res.status(400).json({ message: 'Please provide all details' });
        }

        const [items] = await db.query('SELECT * FROM items WHERE id = ?', [item_id]);

        if (items.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (items[0].user_id === req.user.id) {
            return res.status(400).json({ message: 'You cannot claim your own item' });
        }

        const [existing] = await db.query(
            'SELECT * FROM claims WHERE item_id = ? AND user_id = ?',
            [item_id, req.user.id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'You have already claimed this item' });
        }

        await db.query(
            'INSERT INTO claims (item_id, user_id, description) VALUES (?, ?, ?)',
            [item_id, req.user.id, description]
        );

        res.status(201).json({ message: 'Claim submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getMyClaims = async (req, res) => {
    try {
        const [claims] = await db.query(
            `SELECT claims.*, items.title as item_title, items.image as item_image, items.type as item_type
             FROM claims
             LEFT JOIN items ON claims.item_id = items.id
             WHERE claims.user_id = ?
             ORDER BY claims.created_at DESC`,
            [req.user.id]
        );

        res.json(claims);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getClaimsForMyItems = async (req, res) => {
    try {
        const [claims] = await db.query(
            `SELECT claims.*, items.title as item_title, items.image as item_image, users.name as claimer_name, users.email as claimer_email, users.phone as claimer_phone
             FROM claims
             LEFT JOIN items ON claims.item_id = items.id
             LEFT JOIN users ON claims.user_id = users.id
             WHERE items.user_id = ?
             ORDER BY claims.created_at DESC`,
            [req.user.id]
        );

        res.json(claims);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const updateClaimStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const [claims] = await db.query(
            `SELECT claims.*, items.user_id as owner_id
             FROM claims
             LEFT JOIN items ON claims.item_id = items.id
             WHERE claims.id = ?`,
            [req.params.id]
        );

        if (claims.length === 0) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        if (claims[0].owner_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await db.query('UPDATE claims SET status = ? WHERE id = ?', [status, req.params.id]);

        if (status === 'APPROVED') {
            await db.query('UPDATE items SET status = ? WHERE id = ?', ['CLAIMED', claims[0].item_id]);
        }

        res.json({ message: 'Claim status updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { createClaim, getMyClaims, getClaimsForMyItems, updateClaimStatus };
