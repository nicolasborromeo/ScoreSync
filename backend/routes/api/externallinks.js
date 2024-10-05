const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { ExternalLink } = require('../../db/models');

const router = express.Router();

router.post('/current',
    requireAuth,
    async (req, res) => {

        const { user } = req;
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'Url is required' });
        }

        const usersLinks = await ExternalLink.findAll({ where: { userId: user.id } });

        const linkExists = usersLinks.some(link => link.url === url);
        if (linkExists) {
            return res.status(400).json({ error: 'The link you are trying to add has already been added' });
        }

        const newExternalLink = await ExternalLink.create({ userId: user.id, ...req.body });

        return res.status(201).json({ message: 'Link has been added', newExternalLink });
    }
)

router.delete('/:linkId',
    requireAuth,
    async (req, res) => {

        const linkId = req.params.linkId

        await ExternalLink.destroy({where: {id : linkId}})

        res.status(200).json({ message: 'Successfully deleted' })
    }
)


module.exports = router
