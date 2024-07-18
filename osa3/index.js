const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  response.send(
    `<div>
        <p>Phonebook has info for ${persons.length} people</p>
    </div>
    <div>
        <p>${currentDate}</p>
    </div>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 10000000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const allNames = persons.map((person) => person.name);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or phonenumber is missing",
    });
  } else if (allNames.includes(body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = [...persons, newPerson];

  response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
