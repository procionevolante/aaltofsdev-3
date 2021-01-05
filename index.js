const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

let persons = [
	{
	  "name": "Arto Hellas",
	  "number": "040-123456",
	  "id": 1
	},
	{
	  "name": "Ada Lovelace",
	  "number": "39-44-5323523",
	  "id": 2
	},
	{
	  "name": "Dan Abramov",
	  "number": "12-43-234345",
	  "id": 3
	},
	{
	  "name": "Mary Poppendieck",
	  "number": "39-23-6423122",
	  "id": 4
	}
];

const persAPI = '/api/persons';

app.use(cors());
app.use(express.json());
morgan.token('jsonBody', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :jsonBody'));

app.get(persAPI, (req, res) => {
	res.json(persons);
});

app.get(`${persAPI}/:id`, (req, res) => {
	const id = Number(req.params.id);
	const pers = persons.find(p => p.id === id) || false;

	if (!pers)
		res.sendStatus(404);
	else
		res.json(pers);
});

app.delete(`${persAPI}/:id`, (req, res) => {
	const id = Number(req.params.id);
	const newPersons = persons.filter(p => p.id !== id);

	if (newPersons.length === persons.length)
		res.sendStatus(404);
	else {
		persons = newPersons;
		res.status(204).end();
	}
});

app.post(persAPI, (req, res) => {
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

app.get('/info', (req, res) => {
	const date= new Date().toString();
	res.set('Content-Type', 'text/plain');
	res.send(
`Phonebook has info for ${persons.length} people

${date}`
	);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
