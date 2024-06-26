const express = require('express');
const router = express.Router();
const Template = require('../../models/template');
const Workspace = require('../../models/workspace');
const Information = require('../../models/information');

router.get('/', async function(req, res, next) {
    if (!res.locals.user.permissions.create) {
        return res.status(403).send('Operazione non consentita');
    }

    try {
        const workspaces = await Workspace.find({ 'members.user': res.locals.user._id });
        const fields = await Information.find({ deleted: false });

        res.render('templates/add', {
            title: 'template_add_title',
            workspaces,
            fields
        });
    } catch (error) {
        console.error('Errore durante il recupero dei campi:', error);
        next(error);
    }
});

router.post('/', async (req, res) => {
    if (!res.locals.user.permissions.create) {
        return res.status(403).send('Operazione non consentita');
    }
    try {
        const { title, workspace, info } = req.body;

        const newFieldData = {
            title: title,
            workspace: workspace,
            owner: res.locals.user._id,
            info: info
        }

        const savedTemplate = await Template.create(newFieldData);
        res.status(201).json({ id: savedTemplate.id });
    } catch (error) {
        console.error('Errore durante il salvataggio del campo:', error);
        res.status(500).json({ error: 'Errore durante il salvataggio del campo' });
    }
});

module.exports = router;
