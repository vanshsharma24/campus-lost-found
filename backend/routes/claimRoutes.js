const express = require('express');
const router = express.Router();
const {
    createClaim,
    getMyClaims,
    getClaimsForMyItems,
    updateClaimStatus
} = require('../controllers/claimController');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, createClaim);
router.get('/my', verifyToken, getMyClaims);
router.get('/received', verifyToken, getClaimsForMyItems);
router.patch('/:id/status', verifyToken, updateClaimStatus);

module.exports = router;
