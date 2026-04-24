const express = require('express');
const { requireAuth } = require('../../utils/auth');
const {
    Card,
    User,
    ExternalLink,
    UserDisplayInfo,
    Image,
    Track,
    CardTrack,
    CardBanner,
    CardHeadshot,
    CardColor,
    CardFont,
    CardProfilePic,
} = require('../../db/models');
const router = express.Router();
const { v4: uuidV4 } = require('uuid');

const appBaseUrl = process.env.APP_BASE_URL || 'http://127.0.0.1:5173';

const cardIncludes = [
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
];

const notFoundError = () => {
    const err = new Error('Not Found');
    err.title = 'Card not found';
    err.status = 404;
    err.message = "Card couldn't be found";
    err.errors = { Card: 'Card not found' };
    return err;
};

const forbiddenError = (message = 'You do not have access to this card') => {
    const err = new Error(message);
    err.title = 'Forbidden';
    err.status = 403;
    err.errors = { authorization: message };
    return err;
};

function formatCardResponse(card) {
    if (!card) return null;

    const raw = typeof card.toJSON === 'function' ? card.toJSON() : card;
    raw.Banner = raw.Banner?.[0] ? { ...raw.Banner[0] } : 'No Image associated Yet';
    raw.Headshot = raw.Headshot?.[0] ? { ...raw.Headshot[0] } : 'No Image associated Yet';
    raw.ProfilePic = raw.ProfilePic?.[0] ? { ...raw.ProfilePic[0] } : 'No Image associated Yet';
    raw.Tracks = (raw.Tracks || [])
        .map(track => {
            const nextTrack = { ...track, order: track.CardTrack?.trackOrder || 0 };
            delete nextTrack.CardTrack;
            return nextTrack;
        })
        .sort((a, b) => a.order - b.order);

    return raw;
}

async function getOwnedCard(cardId, userId, include = []) {
    return await Card.findOne({
        where: { id: cardId, userId },
        include,
    });
}

async function getOwnedImage(imgId, userId) {
    return await Image.findOne({ where: { id: imgId, userId } });
}

router.get('/current', requireAuth, async (req, res) => {
    const userCards = await Card.findAll({ where: { userId: req.user.id } });
    return res.status(200).json({ userCards });
});

router.get('/card/:id', requireAuth, async (req, res, next) => {
    const card = await getOwnedCard(req.params.id, req.user.id, cardIncludes);
    if (!card) return next(notFoundError());
    return res.status(200).json(formatCardResponse(card));
});

router.get('/:privateToken', async (req, res) => {
    const card = await Card.findOne({
        where: { privateToken: req.params.privateToken },
        include: cardIncludes,
    });

    if (!card) {
        return res.status(404).send('Card not found');
    }

    return res.status(200).json(formatCardResponse(card));
});

router.put('/tracklist/:cardId', requireAuth, async (req, res, next) => {
    try {
        const { tracklist } = req.body;
        const cardId = Number(req.params.cardId);
        const card = await getOwnedCard(cardId, req.user.id);
        if (!card) return next(notFoundError());

        if (!Array.isArray(tracklist)) {
            return res.status(400).json({ error: 'Invalid tracklist format: Tracklist should be an Array' });
        }

        await Promise.all(
            tracklist.map((track, index) => CardTrack.update(
                { trackOrder: index + 1 },
                { where: { cardId, trackId: track.id } }
            ))
        );

        return res.status(200).json({ message: 'Tracklist order updated successfully' });
    } catch (error) {
        console.error('There was an error updating the tracklist:', error);
        return next(error);
    }
});

router.put('/:cardId/images', requireAuth, async (req, res, next) => {
    const { imgType, imgId } = req.body;
    const cardId = Number(req.params.cardId);

    const card = await getOwnedCard(cardId, req.user.id);
    if (!card) return next(notFoundError());

    const image = await getOwnedImage(imgId, req.user.id);
    if (!image) return next(forbiddenError('Image not found for this user'));

    const config = {
        profile: { Model: CardProfilePic, responseType: 'profile' },
        banner: { Model: CardBanner, responseType: 'banner' },
        headshot: { Model: CardHeadshot, responseType: 'headshot' },
    }[imgType];

    if (!config) {
        return res.status(400).json({ error: 'Invalid image type' });
    }

    const existing = await config.Model.findOne({ where: { cardId } });
    if (!existing) {
        await config.Model.create({ imgId, cardId });
    } else {
        await config.Model.update({ imgId }, { where: { cardId } });
    }

    return res.status(201).json({ newImage: image, imgType: config.responseType });
});

router.delete('/:cardId/:trackId', requireAuth, async (req, res, next) => {
    const { cardId, trackId } = req.params;
    const card = await getOwnedCard(cardId, req.user.id);
    if (!card) return next(notFoundError());

    const deleted = await CardTrack.destroy({ where: { cardId, trackId } });
    if (!deleted) {
        return res.status(404).json({ message: 'Track not found' });
    }

    return res.status(200).json({ message: 'Track removed from card successfully', trackId });
});

router.post('/:cardId/tracklist', requireAuth, async (req, res, next) => {
    const cardId = Number(req.params.cardId);
    const card = await getOwnedCard(cardId, req.user.id);
    if (!card) return next(notFoundError());

    const selectedTracks = req.body.selectedTracks || {};
    const tracksArray = Object.values(selectedTracks);
    const existingTracks = await CardTrack.findAll({ where: { cardId } });
    const existingIds = new Set(existingTracks.map(track => track.trackId));
    let nextOrder = existingTracks.length + 1;

    try {
        await Promise.all(
            tracksArray
                .map(track => Number(track.id))
                .filter(trackId => Number.isFinite(trackId) && !existingIds.has(trackId))
                .map(trackId => CardTrack.create({ trackId, cardId, trackOrder: nextOrder++ }))
        );

        return res.status(201).json({ message: 'Your tracks have been added successfully' });
    } catch (error) {
        return next(error);
    }
});

router.put('/card/:cardId', requireAuth, async (req, res, next) => {
    const { column, editValue } = req.body;
    const card = await getOwnedCard(req.params.cardId, req.user.id);
    if (!card) return next(notFoundError());

    if (!Object.prototype.hasOwnProperty.call(Card.rawAttributes, column)) {
        const error = new Error('Column name was incorrect or does not exist in the card table');
        error.title = 'Column not found';
        error.status = 404;
        return next(error);
    }

    try {
        card[column] = editValue;
        await card.save();
        return res.status(201).json(card);
    } catch (error) {
        return next(error);
    }
});

router.post('/', requireAuth, async (req, res) => {
    const privateToken = uuidV4();
    const title = req.body.title?.trim() || 'Untitled Card';

    try {
        const newCard = await Card.create({
            userId: req.user.id,
            title,
            privateToken,
            previewUrl: `${appBaseUrl}/preview/${privateToken}`,
            publicUrl: `${appBaseUrl}/${privateToken}`
        });

        await Promise.all([
            CardColor.create({ cardId: newCard.id }),
            CardFont.create({ cardId: newCard.id })
        ]);

        res.status(201).json(newCard);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating a new card', error });
    }
});

router.delete('/:cardId', requireAuth, async (req, res, next) => {
    const card = await getOwnedCard(req.params.cardId, req.user.id);
    if (!card) return next(notFoundError());

    await card.destroy();
    return res.status(200).json({ message: 'Card removed successfully', cardId: req.params.cardId });
});

router.put('/:cardId/rename', requireAuth, async (req, res, next) => {
    const card = await getOwnedCard(req.params.cardId, req.user.id);
    if (!card) return next(notFoundError());

    try {
        await card.update({ title: req.body.title?.trim() || card.title });
        res.status(201).json({ message: 'Card title updated successfully' });
    } catch (error) {
        return next(error);
    }
});

router.get('/preview/:privateToken', requireAuth, async (req, res) => {
    const card = await Card.findOne({
        where: { privateToken: req.params.privateToken },
        include: cardIncludes,
    });

    if (!card) {
        return res.status(404).send('Card not found');
    }

    if (card.userId !== req.user.id) {
        return res.status(403).json({ error: 'You do not have access to preview this card' });
    }

    return res.status(200).json(formatCardResponse(card));
});

router.put('/publish/:cardId', requireAuth, async (req, res, next) => {
    const card = await getOwnedCard(req.params.cardId, req.user.id);
    if (!card) return next(notFoundError());

    try {
        await card.update({
            isActive: true,
            publicUrl: `${appBaseUrl}/${card.privateToken || req.body.privateToken}`
        });
        return res.status(201).json(card);
    } catch (error) {
        return next(error);
    }
});

router.put('/unpublish/:cardId', requireAuth, async (req, res, next) => {
    const card = await getOwnedCard(req.params.cardId, req.user.id);
    if (!card) return next(notFoundError());

    try {
        await card.update({ isActive: false });
        res.status(201).json({ message: 'Your card has been unpublished' });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
