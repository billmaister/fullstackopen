import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Persons from "./components/Persons";
import phonebookServices from "./services/persons";
import "./index.css";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notificationMsg, setNotificationMsg] = useState(null);

  const showNotification = (time, msg) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, time);
  };

  useEffect(() => {
    phonebookServices.getAll().then((persons) => setPersons(persons));
  }, []);

  const handleNewName = (e) => {
    e.preventDefault();
    const personInBook = persons.find(
      ({ name }) => name.toLowerCase() === newName.toLowerCase()
    );
    if (personInBook && personInBook.number === newNumber) {
      alert(`${newName} is already in the phonebook with number ${newNumber}`);
    } else if (
      personInBook &&
      window.confirm(
        `${newName} is already in the phonebook, replace the old number with a new one?`
      )
    ) {
      phonebookServices
        .updateInfo(personInBook.id, {
          name: newName,
          number: newNumber,
        })
        .then((updatedPerson) => {
          setPersons((prev) =>
            prev.map((person) =>
              person.id !== updatedPerson.id ? person : updatedPerson
            )
          );
          showNotification(
            2000,
            `${updatedPerson.name} was updated successfully`
          );
        });
    } else {
      const newRow = { name: newName, number: newNumber };
      phonebookServices.addPerson(newRow).then((addedPerson) => {
        setPersons((prev) => [...prev, addedPerson]);
        showNotification(2000, `${addedPerson.name} was added to phonebook`);
      });
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
      phonebookServices.deletePerson(id).then((removedPerson) => {
        setPersons((prev) =>
          prev.filter((person) => person.id !== removedPerson.id)
        );
        showNotification(
          2000,
          `${removedPerson.name} was deleted from phonebook successfully`
        );
      });
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
      <Notification message={notificationMsg} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
