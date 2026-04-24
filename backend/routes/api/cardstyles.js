const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Card, CardColor, CardFont } = require('../../db/models')

router.get('/', requireAuth, async (_req, res) => {
    return res.status(204).end();
});

router.put('/:cardId', requireAuth, async (req, res, next) => {
    const { cardId } = req.params;
    const { colors, font } = req.body;
    const { primaryBackground, secondaryBackground, primaryTextColor, secondaryTextColor, waveformColor } = colors;
    const { fontFamily, fontSize } = font;

    try {
        const card = await Card.findOne({ where: { id: cardId, userId: req.user.id } });
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        await Promise.all([
            CardColor.update(
                { primaryBackground, secondaryBackground, primaryTextColor, secondaryTextColor, waveformColor },
                { where: { cardId } }
            ),
            CardFont.update(
                { fontFamily, fontSize },
                { where: { cardId } }
            )
        ]);

        return res.status(200).json({ message: 'Card styles updated successfully' });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
