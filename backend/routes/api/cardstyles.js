const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { CardColor, CardFont } = require('../../db/models')


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
        const { colors, font } = req.body
        const { primaryBackground, secondaryBackground, primaryTextColor, secondaryTextColor, waveformColor } = colors
        const {fontFamily, fontSize} = font
  
        try {
            const updatedColors = await CardColor.update(
                {
                    primaryBackground, secondaryBackground, primaryTextColor, secondaryTextColor, waveformColor
                },
                {
                    where: {cardId: cardId}
                }
            )
            const updatedFont = await CardFont.update(
                {
                    fontFamily, fontSize
                },
                {
                    where: {cardId: cardId}
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
