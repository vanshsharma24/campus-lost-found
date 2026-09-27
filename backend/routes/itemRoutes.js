const express = require('express');
const router = express.Router();
const {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem,
    getMyItems,
    markReturned
} = require('../controllers/itemController');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAllItems);
router.get('/my/items', verifyToken, getMyItems);
router.get('/:id', getItemById);
router.post('/', verifyToken, upload.single('image'), createItem);
router.put('/:id', verifyToken, upload.single('image'), updateItem);
router.delete('/:id', verifyToken, deleteItem);
router.patch('/:id/return', verifyToken, markReturned);

module.exports = router;
