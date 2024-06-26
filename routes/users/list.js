const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const { getRoles } = require('../../config/permissions');

router.get('/', async (req, res) => {
    if (res.locals.user.permissions.manage_users) {
        try {
            const users = await User.find({});
            
            res.render('users/list', {
                title: 'user_list_title',
                users, 
                roles: getRoles()
            });
            
        } catch (error) {
            console.error('Errore durante la query al database:', error);
            res.status(500).json({ error: 'Errore del server interno' });
        }
    } else {
        return res.status(403).send('Not allowed');
    }
});

module.exports = router;
