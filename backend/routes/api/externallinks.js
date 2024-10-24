const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { ExternalLink } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation')
const { check, body, query } = require('express-validator')

const router = express.Router();

router.get(
    '/',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        try {
            const usersLinks = await ExternalLink.findAll({ where: { userId: user.id } });
            return res.status(200).json(usersLinks)
        } catch (error) {
            res.json(error)
            return next(error)
        }
    }
)

const validateUrl = [
    body('url')
        .exists()
        .notEmpty()
        .withMessage("url is required")
        .matches(/^(http:\/\/|https:\/\/)/i)
        .withMessage("URL must start with 'http://' or 'https://' ")
        .isURL()
        .withMessage("Please enter a valid URL")
        .custom(async (url, { req }) => {
            const { user } = req;
            const usersLinks = await ExternalLink.findAll({ where: { userId: user.id } });
            const linkExists = usersLinks.some(link => link.url === url);
            if (linkExists) {
                return Promise.reject('The link you are trying to add has already been added');
            }
        })
        .withMessage('The link already exists'),
    handleValidationErrors
]

router.post('/',
    requireAuth,
    validateUrl,
    async (req, res, next) => {
        const { user } = req;
        const { url } = req.body;

        const newExternalLink = await ExternalLink.create({ userId: user.id, ...req.body });

        return res.status(201).json({ message: 'Link has been added', newExternalLink });
    }
)

router.delete('/:linkId',
    requireAuth,
    async (req, res) => {

        const linkId = req.params.linkId

        await ExternalLink.destroy({ where: { id: linkId } })

        res.status(200).json({ message: 'Successfully deleted' })
    }
)


module.exports = router
