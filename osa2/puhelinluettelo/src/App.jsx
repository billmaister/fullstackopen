import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Persons from "./components/Persons";
import phonebookServices from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    phonebookServices.getAll().then((persons) => setPersons(persons));
  }, []);

  const handleNewName = (e) => {
    e.preventDefault();
    if (
      persons.find(({ name }) => name.toLowerCase() === newName.toLowerCase())
    ) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const newRow = { name: newName, number: newNumber };
      phonebookServices
        .addPerson(newRow)
        .then((addedPerson) => setPersons((prev) => [...prev, addedPerson]));
    }
    setNewName("");
    setNewNumber("");
  };

  const handleDelete = (id, name) => {
    if (
      window.confirm(
        `Are you sure that you want to delete ${name} from the phonebook?`
      )
    ) {
      phonebookServices
        .deletePerson(id)
        .then((removedPerson) =>
          setPersons((prev) =>
            prev.filter((person) => person.id !== removedPerson.id)
          )
        );
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add new name</h2>
      <Form
        handleNewName={handleNewName}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
