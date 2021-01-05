const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.6z4vm.mongodb.net/fsdevphonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema);

if (process.argv.length > 3) {
	// add person to DB
	const name = process.argv[3];
	const number = process.argv[4];
	const pers = new Person({name, number});
	
	pers.save().then(result => {
	  console.log(`added ${name} number ${number} to phonebook`);
	  mongoose.connection.close()
	});
}else{
	// list all persons
	console.log('phonebook:');
	Person.find({}).then(result => {
		result.forEach(p =>
			console.log(p.name, p.number)
		);
		mongoose.connection.close();
	});
}
