require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();
const PORT = process.env.PORT || 3001;

const persAPI = '/api/persons';

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
morgan.token('jsonBody', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :jsonBody'));

app.get(persAPI, (req, res) => {
	Person.find({}).then(result => res.json(result));
});

app.get(`${persAPI}/:id`, (req, res) => {
	const id = req.params.id;
	Person.findById(id).then(p => {
		if (!p)
			res.sendStatus(404);
		else
			res.json(p);
	}).catch(err => res.status(500).end());
});

app.delete(`${persAPI}/:id`, (req, res, next) => {
	const id = req.params.id;

	Person.findByIdAndRemove(id).then(result =>
		res.status(204).end()
	).catch(err => next(err));
});

app.post(persAPI, (req, res, next) => {
	const name = req.body.name;
	const number = req.body.number;
	const pers = new Person({name, number});
	
	pers.save().then(savedPers => res.json(savedPers))
		.catch(err => next(err));
	return;

	// code prior to mongoDB adoption
	const id = Math.floor(Math.random() * 1000000000);
	const newPers = {...req.body, id};

	if (!newPers.name || !newPers.number)
		return res.status(400)
			.json({err: 'Person must have "name" and "number" property'});

	if (persons.map(p=>p.name).includes(newPers.name))
		return res.status(400)
			.json({err: 'Person name must be unique'});

	persons.push(newPers);
	res.json(newPers);
});

app.put(`${persAPI}/:id`, (req, res, next) => {
	const id = req.params.id;
	const name = req.body.name;
	const number = req.body.number;
	const pers = {name, number};

	Person.findByIdAndUpdate(id, pers, { new: true })
		.then(updatedPers => res.json(updatedPers))
		.catch(error => next(error));
})

app.get('/info', (req, res) => {
	const date= new Date().toString();
	Persons.find({}).then (result => {
		res.set('Content-Type', 'text/plain');
		res.send(
`Phonebook has info for ${result.length} people

${date}`
		);
	});
});

const notFound = (req, res) => {
	res.sendStatus(404);
}

app.use(notFound);

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

	response.sendStatus(500);
  next(error)
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
