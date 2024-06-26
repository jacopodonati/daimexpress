const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Workspace = require('../../models/workspace');

router.get('/', async (req, res) => {
    try {
        const ownProfile = await User.findById(res.locals.user._id);
        if (ownProfile) {
            await ownProfile.populate('workspaces');
            res.render('users/personal_profile', {
                title: 'user_profile_title',
                ownProfile
            });
        } else {
            res.status(404).json({});
        }
    } catch (error) {
        console.error('Errore durante il recupero dell\'utente:', error);
        res.status(500).json({ error: 'Errore durante il recupero dell\'utente' });
    }
});

router.post('/', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(res.locals.user._id, req.body, { new: true });
        if (updatedUser) {
            return res.status(200).json({ updatedUser });
        }
    } catch (error) {
        console.error('Error updating document in the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/leave', async (req, res) => {
    try {
        const workspaceId = req.body.workspace_id;
        const updatedUser = await User.findByIdAndUpdate(
            res.locals.user._id,
            { $pull: { workspaces: workspaceId } },
            { new: true }
        );
        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            workspaceId,
            { $pull: { members: { user: res.locals.user._id } } },
            { new: true }
        );
        
        if (updatedUser && updatedWorkspace) {
            res.status(200).json({'id': workspaceId});
        } else {
            res.status(404).json({ error: 'Documents not found' });
        }
    } catch (error) {
        console.error('Error updating document in the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
