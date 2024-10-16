const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Card, User, ExternalLink, UserDisplayInfo, Image, Track, CardTrack } = require('../../db/models');
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
                {
                    model: User,
                    include: [
                        { model: ExternalLink },
                        { model: UserDisplayInfo }
                    ]
                },
                {
                    model: Image, // Include images associated via CardBanner
                    as: 'Banner' // Ensure this matches the alias used in the association
                },
                {
                    model: Image, // Include images associated via CardHeadshot
                    as: 'Headshot' // Ensure this matches the alias used in the association
                },
                {
                    model: Track,
                    attributes: ['id', 'duration', 'filePath', 'title'],
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
        //formatting the return if Card exsists
        if (card) {
            card = card.toJSON()
            card.Banner = card.Banner ? { ...card.Banner[0] } : 'No Image associated Yet'
            card.Headshot = card.Headshot ? { ...card.Headshot[0] } : 'No Image associated Yet'
            let formattedTracks = card.Tracks.map(track => {
                track.order = track.CardTrack.trackOrder
                delete track.CardTrack
                return track
            })
            delete card.Tracks
            card.Tracks = formattedTracks.sort((a, b) => a.order - b.order)
        }
        return res.status(200).json(card)
    }
)

///UPDATE TRACKLIST ORDER

router.put(
    '/tracklist/:cardId',
    requireAuth,
    async (req, res, next) => {

        try {
            const { tracklist } = req.body;

            if (!Array.isArray(tracklist)) {
                return res.status(400).json({ error: 'Invalid tracklist format: Tracklist should be an Array' });
            }

            const promises = tracklist.map((track, index) => {
                return CardTrack.update(
                    {
                        trackOrder: index + 1
                    },
                    {
                        where: {
                            cardId: req.params.cardId,
                            trackId: track.id
                        }
                    })
            })

            await Promise.all(promises)
            return res.status(200).json({ message: 'Tracklist order updated successfully' });

        } catch (error) {
            console.error('There was an error updating the tracklist:', error);
            return next(error);
        }
    }
)

//UPDATE CUSTOM CARD ELEMENTS
router.put(
    '/:cardId',
    requireAuth,
    async (req, res, next) => {
        const {column, editValue} = req.body
        const cardId = req.params.cardId
        const card = await Card.findByPk(cardId)
        if(!card[column]) {
            const error = new Error()
            error.title = 'Column not found'
            error.message = 'Column name was incorrect or does not exist in the card table'
            error.status = 404
            return next(error)
        } else {
            try {
                card[column] = editValue
                await card.save()
                return res.status(201).json(card)
            } catch (error) {
                return res.json(error)
            }
        }
    }
)


module.exports = router
