const mongoose = require('mongoose');

const commentSchema = mongoose.schema({
	_id: mongoose.Types.ObjectId,
    content: {
        type: String,
        required: true
    },
    author: {
    	type: String,
    	required: true
    },
    datePosted: {
        type: Date,
        required: true
    }
})