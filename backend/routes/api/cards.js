const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Card } = require('../../db/models');
const router = express.Router();



router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const userCards = await Card.findAll({ where: { userId: user.id } });

        return res.status(200).json({ userCards: userCards });
    },
)

module.exports = router
