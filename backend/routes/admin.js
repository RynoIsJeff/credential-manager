
const express = require('express');
const User = require('../models/User');
const Division = require('../models/Division');
const OU = require('../models/OU');
const { verifyToken, adminPermission } = require("./users")

const router = express.Router();

// Change user role endpoint
router.put('/change-role/:userId', verifyToken, adminPermission, async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user role
        user.role = role;
        await user.save();

        res.json({ message: 'User role changed successfully' });
    } catch (error) {
        console.error('Error changing user role:', error);
        res.status(500).json({ message: 'An error occurred while changing user role' });
    }
});

// Design user from OU endpoint
router.put('/design-ou/:userId/:ouId', verifyToken, adminPermission, async (req, res) => {
    const { userId, ouId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the OU by ouId
        const ou = await OU.findById(ouId);
        if (!ou) {
            return res.status(404).json({ message: 'OU not found' });
        }

        // Check if the user is already designated from the OU
        const isDesignated = user.ous.some(assignedOU => assignedOU.toString() === ouId);
        if (isDesignated) {
            return res.status(400).json({ message: 'User already designated from the OU' });
        }

        // Designate the user from the OU
        user.ous.push(ouId);
        await user.save();

        res.json({ message: 'User designated from the OU successfully' });

    } catch (error) {
        console.error('Error designating user from OU:', error);
        res.status(500).json({ message: 'An error occurred while designating user from OU' });
    }
});

// Assign user to division endpoint
router.put('/assign-division/:userId/:divisionId', verifyToken, adminPermission, async (req, res) => {
    const { userId, divisionId } = req.params;

    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the division by divisionId
        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).json({ message: 'Division not found' });
        }

        // Check if the user is already assigned to the division
        const isAssigned = user.divisions.some(assignedDivision => assignedDivision.toString() === divisionId);
        if (isAssigned) {
            return res.status(400).json({ message: 'User already assigned to the division' });
        }

        // Assign the user to the division\
        user.divisions.push(division);
        await user.save();

        res.json({ message: 'User assigned to the division successfully' });

    } catch (error) {
        console.error('Error assigning user to division:', error);
        res.status(500).json({ message: 'An error occurred while assigning user to division' });
    }
});

// De-assign user from division endpoint
router.put('/de-assign-division/:userId/:divisionId', verifyToken, adminPermission, async (req, res) => {
    const { userId, divisionId } = req.params;

    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is assigned to the division
        const isAssigned = user.divisions.some(assignedDivision => assignedDivision.toString() === divisionId);
        if (!isAssigned) {
            return res.status(400).json({ message: 'User is not assigned to the division' });
        }

        // Remove the division from the user's divisions array
        user.divisions = user.divisions.filter(assignedDivision => assignedDivision.toString() !== divisionId);
        await user.save();

        res.json({ message: 'User de-assigned from the division successfully' });

    } catch (error) {
        console.error('Error de-assigning user from division:', error);
        res.status(500).json({ message: 'An error occurred while de-assigning user from division' });
    }
});

// De-Assign User to OU endpoint
router.put('/de-assign-ou/:userId/:ouId', verifyToken, adminPermission, async (req, res) => {
    const { userId, ouId } = req.params;

    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is designated from the OU
        const isDesignated = user.ous.some(assignedOU => assignedOU.toString() === ouId);
        if (!isDesignated) {
            return res.status(400).json({ message: 'User is not designated from the OU' });
        }

        // Remove the OU from the user's ous array
        user.ous = user.ous.filter(assignedOU => assignedOU.toString() !== ouId);
        await user.save();

        res.json({ message: 'User de-designated from the OU successfully' });

    } catch (error) {
        console.error('Error de-designating user from OU:', error);
        res.status(500).json({ message: 'An error occurred while de-designating user from OU' });
    }
});

// Get all users
router.get('/users', verifyToken, adminPermission, async (req, res) => {
    try {
        const users = await User.find().populate("divisions").populate({ path: 'ous', populate: { path: "divisions" } });;
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'An error occurred while fetching users' });
    }
});



// Get all OUs
router.get('/ous', verifyToken, adminPermission, async (req, res) => {
    try {
        const ous = await OU.find().populate("divisions");
        res.json(ous);

    } catch (error) {
        console.error('Error fetching OUs:', error);
        res.status(500).json({ message: 'An error occurred while fetching OUs' });
    }
});


module.exports = router