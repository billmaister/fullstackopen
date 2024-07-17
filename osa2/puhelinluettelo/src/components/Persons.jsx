const Persons = ({ persons, filter, handleDelete }) => {
  return (
    <div>
      {persons &&
        persons
          .filter(({ name }) =>
            name.toLowerCase().includes(filter.toLowerCase())
          )
          .map((person) => (
            <div key={person.id}>
              <p>
                {person.name} {person.number}
              </p>
              <button onClick={() => handleDelete(person.id, person.name)}>
                delete
              </button>
            </div>
          ))}
    </div>
  );
};

export default Persons;
