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
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 2000);
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
      const newInfo = {
        name: newName,
        number: newNumber,
      };
      phonebookServices
        .updateInfo(personInBook.id, newInfo)
        .then((updatedPerson) => {
          setPersons((prev) =>
            prev.map((person) =>
              person.id !== updatedPerson.id ? person : updatedPerson
            )
          );
          showNotification(
            `${updatedPerson.name} was updated successfully`,
            "success"
          );
        })
        .catch((error) => {
          if (error.response.status === 404) {
            showNotification(
              `Error code ${error.response.status}: ${newInfo.name} has already been removed from the server`,
              "error"
            );
            setPersons((prev) =>
              prev.filter((person) => person.id !== personInBook.id)
            );
          } else {
            showNotification(
              `Error code ${error.response.status}: Couldn't update ${newInfo.name}`,
              "error"
            );
          }
        });
    } else {
      const newRow = { name: newName, number: newNumber };
      phonebookServices
        .addPerson(newRow)
        .then((addedPerson) => {
          setPersons((prev) => [...prev, addedPerson]);
          showNotification(
            `${addedPerson.name} was added to phonebook`,
            "success"
          );
        })
        .catch((error) => {
          showNotification(
            `Error code ${error.response.status}: Couldn't add ${newRow.name} to phonebook`,
            "error"
          );
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
      phonebookServices
        .deletePerson(id)
        .then((removedPerson) => {
          setPersons((prev) => prev.filter((person) => person.id !== id));
          showNotification(
            `${name} was deleted from phonebook successfully`,
            "success"
          );
        })
        .catch((error) => {
          if (error.response.status === 404) {
            showNotification(
              `Error code ${error.response.status}: Couldn't delete, ${name} already removed from the phonebook`,
              "error"
            );
            setPersons((prev) => prev.filter((person) => person.id !== id));
          } else {
            showNotification(
              `Error code ${error.response.status}: Couldn't delete ${name} from the phonebook`,
              "error"
            );
          }
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
      <Notification notification={notification} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
