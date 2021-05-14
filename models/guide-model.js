const mongoose = require('mongoose');

const guideSchema = mongoose.Schema({
	_id: mongoose.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    author: {
    	type: String,
    	required: true
    },
    tagline: {
        type: String,
        required: true
    },
    content: {
    	type: String,
    	required: true
    },
    likes: {
        type: Number,
        required: true
    },
    datePosted: {
        type: Date,
        required: true,
    },
    Comments: {
        type: Array,
        required: true
    },
    Category: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Guide', guideSchema);