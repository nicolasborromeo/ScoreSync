const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Card, User, ExternalLink, UserDisplayInfo, CardBanner, Image, CardHeadshot} = require('../../db/models');
const cardheadshot = require('../../db/models/cardheadshot');
const router = express.Router();



router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const userCards = await Card.findAll({ where: { userId: user.id } });

        return res.status(200).json({ userCards: userCards });
    },
);

router.get(
    '/:id',
    requireAuth,
    async (req, res) => {
        let card = await Card.findByPk(req.params.id, {
            include: [
                {model: User, include: [{model: ExternalLink}, {model:UserDisplayInfo}]},
                {
                    model: Image, // Include images associated via CardBanner
                    as: 'Banner' // Ensure this matches the alias used in the association
                },
                {
                    model: Image, // Include images associated via CardHeadshot
                    as: 'Headshot' // Ensure this matches the alias used in the association
                }
            ]
        })
        //error generator if Card doesn't exists
        if (!card) {
            let err = new Error('Not Found')
            err.title = 'Card not found'
            err.status = 404
            err.message = "Card couldn't be found"
            err.errors = { Card: 'Card not found' }
            return next(err)
        }
        if (card) {
            card = card.toJSON()
            // If Banners array has exactly 1 image, replace it with the single object
            card.Banner = card.Banner ? {...card.Banner[0]} : 'No Image associated Yet'
            card.Headshot = card.Headshot ? {...card.Headshot[0]} : 'No Image associated Yet'
            // if (card.Banners && card.Banners.length === 1) {
            // }
            // If Headshots array has exactly 1 image, replace it with the single object
            // card.Headshots = {...card.Headshots[0]};
            // if (card.Headshots && card.Headshots.length === 1) {
            // }
        }
        return res.status(200).json(card)
    }
)


module.exports = router
