const express = require('express');
const router = express.Router();
const RecipeSeeker = require('../../models/RecipeSeekerSchema');
const Comment = require('../../models/Comment Schema');

//get all the comments of a specific recipe
router.get('/:recipeId/comments', async(req,res) =>{
    const { recipeId } = req.params;

    try {
        const comments = await Comment.find({ recipe: recipeId })
        .populate({
            path: 'user',
            model: RecipeSeeker,
            select: 'username', //get the username
        })
        .select('comment Time user');

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch comments' });
    }

});

module.exports = router;