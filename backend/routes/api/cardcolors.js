const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Card, CardColor } = require('../../db/models')


router.get(
    '/',
    requireAuth,
    async (req, res) => {

    }
)

router.put(
    '/:cardId',
    requireAuth,
    async (req, res, next) => {
        const { cardId } = req.params
        const { colors } = req.body
        const { primaryBackground, secondaryBackground, primaryTextColor, secondaryTextColor, waveformColor } = colors

        try {
            const updatedColors = await CardColor.update(
                { primaryBackground, secondaryBackground, primaryTextColor, secondaryTextColor, waveformColor },
                {
                    where: {
                        cardId: cardId
                    }
                }
            )
            res.status(200).json(updatedColors)
        } catch (error) {
            res.json(error)
            return next(error)
        }
    }
)

module.exports = router
