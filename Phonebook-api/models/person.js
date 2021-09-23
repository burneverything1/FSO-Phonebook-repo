const mongoose = require('mongoose')
const uniqueVaidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.connect(url, {
    useNewUrlParser: true, useUnifiedTopology: true,
    useFindAndModify: false, useCreateIndex: true
})
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        required: true,
        minLength: 8
    },
})

// add unique validation
personSchema.plugin(uniqueVaidator)

// format what is returned by mongoDB by modifying 'toJSON'
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)