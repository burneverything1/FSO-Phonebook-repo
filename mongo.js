const mongoose = require('mongoose')

const password = process.argv[2]

const url = 
    `mongodb+srv://timmyylee95:${password}@cluster0.o1axb.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

// if no person added, print database
if (process.argv.length = 3) {
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`);
            })
            mongoose.connection.close()
            process.exit(0)
        })
}


const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

person
    .save()
    .then(result => {
        console.log(result);
        console.log(`added ${result.name} number ${result.number} to phonebook`);
        mongoose.connection.close()
    })