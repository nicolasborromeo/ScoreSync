const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Card, User, ExternalLink, UserDisplayInfo, Image, Track, CardTrack, CardBanner, CardHeadshot, CardColor, CardFont, CardProfilePic } = require('../../db/models');
const router = express.Router();
const { v4: uuidV4 } = require('uuid');
const e = require('express');
const { APP_BASE_URL } = process.env;

// 404 Error generator
const notFoundError = () => {
    let err = new Error('Not Found')
    err.title = 'Card not found'
    err.status = 404
    err.message = "Card couldn't be found"
    err.errors = { Card: 'Card not found' }
    return err
}

//Format Card Response Helper Function
function formatCardResponse(card) {
    if (!card) return null;

    card = card.toJSON();
    card.Banner = card.Banner ? { ...card.Banner[0] } : 'No Image associated Yet';
    card.Headshot = card.Headshot ? { ...card.Headshot[0] } : 'No Image associated Yet';
    card.ProfilePic = card.ProfilePic ? { ...card.ProfilePic[0] } : 'No Image associated Yet';

    const formattedTracks = card.Tracks.map(track => {
        track.order = track.CardTrack.trackOrder;
        delete track.CardTrack;
        return track;
    });

    card.Tracks = formattedTracks.sort((a, b) => a.order - b.order);

    return card;
}


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
    '/card/:id',
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
                { model: Image, as: 'Banner' },
                { model: Image, as: 'Headshot' },
                { model: Image, as: 'ProfilePic' },
                {
                    model: Track,
                    attributes: ['id', 'duration', 'filePath', 'title'],
                },
                {
                    model: CardColor,
                    attributes: {
                        exclude: ['id', 'cardId', 'updatedAt', 'createdAt']
                    }
                },
                {
                    model: CardFont,
                    attributes: {
                        exclude: ['id', 'cardId', 'updatedAt', 'createdAt']
                    }
                }
            ]
        })
        //error generator if Card doesn't exists
        if (!card) return next(notFoundError())
        //formatting the return if Card exsists
        if (card) {
            card = card.toJSON()
            card.Banner = card.Banner ? { ...card.Banner[0] } : 'No Image associated Yet'
            card.Headshot = card.Headshot ? { ...card.Headshot[0] } : 'No Image associated Yet'
            card.ProfilePic = card.ProfilePic ? { ...card.ProfilePic[0] } : 'No Image associated Yet'
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

router.get(
    '/:privateToken',
    async (req, res) => {
        const {privateToken} = req.params
        let card = await Card.findOne({
            where: { privateToken },
            include: [
                {
                    model: User,
                    include: [
                        { model: ExternalLink },
                        { model: UserDisplayInfo }
                    ]
                },
                { model: Image, as: 'Banner' },
                { model: Image, as: 'Headshot' },
                { model: Image, as: 'ProfilePic' },
                {
                    model: Track,
                    attributes: ['id', 'duration', 'filePath', 'title']
                },
                {
                    model: CardColor,
                    attributes: { exclude: ['id', 'cardId', 'updatedAt', 'createdAt'] }
                },
                {
                    model: CardFont,
                    attributes: { exclude: ['id', 'cardId', 'updatedAt', 'createdAt'] }
                }
            ]
        });

        if (!card) {
            return res.status(404).send('Card not found');
        }
        card = formatCardResponse(card);
        return res.status(200).json(card);

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

// UPDATE CARD IMAGES
router.put('/:cardId/images', requireAuth, async (req, res, next) => {
    const { imgType, imgId } = req.body;
    const { cardId } = req.params;

    if (imgType === 'profile') {
        const cardProfilePic = await CardProfilePic.findOne({ where: { cardId } });

        if (!cardProfilePic) {
            await CardProfilePic.create({ imgId, cardId });
        } else {
            await CardProfilePic.update({ imgId }, { where: { cardId } });
        }

        const newImage = await Image.findByPk(imgId);
        return res.status(201).json({ newImage, imgType: 'profile' });
    }

    if (imgType === 'banner') {
        const cardBanner = await CardBanner.findOne({ where: { cardId } });

        if (!cardBanner) {
            await CardBanner.create({ imgId, cardId });
        } else {
            await CardBanner.update({ imgId }, { where: { cardId } });
        }

        const newImage = await Image.findByPk(imgId);
        return res.status(201).json({ newImage, imgType: 'banner' });
    }

    if (imgType === 'headshot') {
        const cardHeadshot = await CardHeadshot.findOne({ where: { cardId } });

        if (!cardHeadshot) {
            await CardHeadshot.create({ imgId, cardId });
        } else {
            await CardHeadshot.update({ imgId }, { where: { cardId } });
        }

        const newImage = await Image.findByPk(imgId);
        return res.status(201).json({ newImage, imgType: 'headshot' });
    }
});


//REMOVE TRACK FROM CARD TRACKLIST
router.delete(
    '/:cardId/:trackId',
    requireAuth,
    async (req, res) => {
        const { cardId, trackId } = req.params;
        const deleted = await CardTrack.destroy({
            where: { cardId, trackId },
        });
        if (deleted) {
            return res.status(200).json({ message: 'Track removed from card successfully', trackId });
        } else {
            return res.status(404).json({ message: 'Track not found' });
        }
    }
)

//ADD TRACKS TO CARD TRACKLIST
router.post(
    '/:cardId/tracklist',
    requireAuth,
    async (req, res) => {
        const cardId = Number(req.params.cardId)
        const { selectedTracks } = req.body
        const tracksArray = Object.values(selectedTracks)
        const promises = tracksArray.map(track => {
            let trackId = Number(track.id)
            return CardTrack.create({ trackId, cardId })
        })
        try {
            await Promise.all(promises)
            return res.status(201).json({ message: 'Your tracks have been added succesfully' })
        } catch (error) {
            return res.json(error)
        }
    }
)

//UPDATE CARD'S CUSTOM/EDITABLE FIELDS
router.put(
    '/card/:cardId',
    requireAuth,
    async (req, res, next) => {
        const { column, editValue } = req.body
        const cardId = req.params.cardId
        const card = await Card.findByPk(cardId)

        if (!Card.rawAttributes.hasOwnProperty(column)) {
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

//CREATE NEW EMPTY CARD
router.post(
    '/',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const privateToken = uuidV4()
        const { title } = req.body
        try {
            const newCard = await Card.create({
                userId: user.id,
                title: title,
                privateToken: privateToken,
                previewUrl: `${APP_BASE_URL}/cards/${privateToken}`
            })

            await CardColor.create({ cardId: newCard.id })
            await CardFont.create({ cardId: newCard.id })
            res.status(201).json(newCard)
        } catch (error) {
            res.status(500).json({ message: 'An error ocurred while creating a new Card', error })
        }

    }
)

//DELETE CARD
router.delete(
    '/:cardId',
    requireAuth,
    async (req, res) => {
        const { cardId } = req.params
        const deleted = await Card.destroy({ where: { id: cardId } })
        if (deleted) {
            return res.status(200).json({ message: 'Card removed from card successfully', cardId });
        } else {
            return res.status(404).json({ message: 'Card not found' });
        }
    }
)

//RENAME CARD
router.put(
    '/:cardId/rename',
    requireAuth,
    async (req, res, next) => {
        const cardId = req.params.cardId
        const { title } = req.body
        const card = await Card.findByPk(cardId)
        if (!card) {
            return next(notFoundError)
        }
        try {
            await card.update({ title: title })
            res.status(201).json({ message: 'Card title updated succesfully' })
        } catch (error) {
            res.status(500).json({ message: 'There was an error while updating the title: ', error })
            return next(error)
        }
    }
)
// GET PREVIEW CARD
router.get('/preview/:privateToken', requireAuth, async (req, res) => {
    const { privateToken } = req.params;
    let card = await Card.findOne({
        where: { privateToken },
        include: [
            {
                model: User,
                include: [
                    { model: ExternalLink },
                    { model: UserDisplayInfo }
                ]
            },
            { model: Image, as: 'Banner' },
            { model: Image, as: 'Headshot' },
            { model: Image, as: 'ProfilePic' },
            {
                model: Track,
                attributes: ['id', 'duration', 'filePath', 'title']
            },
            {
                model: CardColor,
                attributes: { exclude: ['id', 'cardId', 'updatedAt', 'createdAt'] }
            },
            {
                model: CardFont,
                attributes: { exclude: ['id', 'cardId', 'updatedAt', 'createdAt'] }
            }
        ]
    });

    if (!card) {
        return res.status(404).send('Card not found');
    }

    // Format the return if Card exists
    if (card) {
        card = card.toJSON();
        card.Banner = card.Banner ? { ...card.Banner[0] } : 'No Image associated Yet';
        card.Headshot = card.Headshot ? { ...card.Headshot[0] } : 'No Image associated Yet';
        card.ProfilePic = card.ProfilePic ? { ...card.ProfilePic[0] } : 'No Image associated Yet';

        const formattedTracks = card.Tracks.map(track => {
            track.order = track.CardTrack.trackOrder;
            delete track.CardTrack;
            return track;
        });

        card.Tracks = formattedTracks.sort((a, b) => a.order - b.order);
    }

    return res.status(200).json(card);
});

//PUBLISH CARD
router.put(
    '/publish/:cardId',
    requireAuth,
    async (req, res, next) => {
        const { cardId } = req.params
        const { privateToken } = req.body

        try {
            const card = await Card.findByPk(cardId)
            if (!card) {
                return res.status(404).json({ error: "Card not found" });
            }
            card.update({
                isActive: true,
                publicUrl: `${APP_BASE_URL}/${privateToken}`
            })
            return res.status(201).json(card)

        } catch (error) {
            return next(error)
        }
    }
)

router.put(
    '/unpublish/:cardId',
    requireAuth,
    async (req, res, next) => {
        const { cardId } = req.params

        try {
            const card = await Card.findByPk(cardId)
            card.update({ isActive: false })
            res.status(201).json({ message: 'Your card has been unpublished' })
        } catch (error) {
            return next(error)
        }
    }
)

module.exports = router
