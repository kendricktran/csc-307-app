import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";


function MyApp() {
  const [characters, setCharacters] = useState([]);


  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  function removeOneCharacter(index){
    deleteUser(index)
      .then(() => setCharacters([...updated]))
      .catch((error) => {
        console.log(error);
      })
  }

  function deleteUser (index) {
    return fetch(`http://localhost:8000/users/${characters[index].id}`, {
      method: "DELETE"
    })
    .then(response => {
      if (response.status === 204) {
        const updated = [...characters];
        updated.splice(index, 1);
        setCharacters(updated);
        return Promise.resolve(); // Successful delete
      } else if (response.status === 404) {
        return Promise.reject("Resource not found"); // User not found
      } else {
        return Promise.reject("Failed to delete user"); // Other errors
      }
    })
    .catch(error => {
      console.error("Error:", error);
      throw error; // Rethrow the error to propagate it to the caller
    });
  }

  function updateList(person) { 
    postUser(person)
      .then(() => setCharacters([...characters, person]))
      .catch((error) => {
        console.log(error);
    })
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    })
    .then(response => {
      if (response.status === 201) {
        return response.json();
      } else {
        throw new Error("Failed to create user");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      throw error;
    });
  }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );

}

export default MyApp;