import axios from "axios";
const personsURL = "http://localhost:3001/persons";

const getAll = () => {
  const request = axios.get(personsURL);
  return request.then((response) => response.data);
};

const addPerson = (newRow) => {
  const request = axios.post(personsURL, newRow);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${personsURL}/${id}`);
  return request.then((response) => response.data);
};

const updateInfo = (id, newInfo) => {
  const request = axios.put(`${personsURL}/${id}`, newInfo);
  return request.then((response) => response.data);
};

export default { getAll, addPerson, deletePerson, updateInfo };
