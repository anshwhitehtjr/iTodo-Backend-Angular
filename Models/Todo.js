const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    desc: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const todo = mongoose.model('todo', TodoSchema);
module.exports = todo;
