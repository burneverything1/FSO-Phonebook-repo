import React, { useEffect, useState } from 'react'
import SearchFilter from './components/SearchFilter'
import AddNew from './components/AddNew'
import Numbers from './components/Numbers'
import phonebook from './services/phonebook'
import Notification from './components/Notification'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newPhone, setNewPhone ] = useState('')
  const [ filterText, setNewFilter ] = useState('')
  const [ notifMessage, setNotifMessage ] = useState(null)
  const [ notifType, setNotifType ] = useState('')

  const submitHandler = (event) => {
    event.preventDefault()
    //check if name is in phonebook
    let personsNames = persons.map(person => person.name)
    if (personsNames.includes(newName)){
      let alreadyPerson = persons.find(person => person.name === newName)
      if (window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {...alreadyPerson, phone: newPhone}
        phonebook
          .updatePerson(alreadyPerson.id, updatedPerson)
          .then(() => {
            loadPersons()
            // set notification message
            setNotifMessage(`${newName} has been updated in phonebook`)
            setNotifType('green')
            setNewName('')
            setNewPhone('')
            setTimeout(() => {
              setNotifMessage(null)
            }, 3000);
          })
      }
    } else {
        let nameSubmit = {
          name: newName,
          phone: newPhone
        }
        phonebook
          .create(nameSubmit)
          .then(response => {
            setPersons(persons.concat(response.data))
            // notification message
            setNotifMessage(`${newName} has been created in phonebook`)
            setNotifType('green')
            setTimeout(() => {
              setNotifMessage(null)
            }, 3000);
            setNewName('')
            setNewPhone('')
          })
    }
  }

  const loadPersons = () => {
    phonebook
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }

  useEffect(loadPersons, [])

  const nameChangeHandler = (event) => {
    setNewName(event.target.value)
  }

  const phoneChangeHandler = (event) => {
    setNewPhone(event.target.value)
  }

  // filter people being shown through search text
  const personsToShow = filterText.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(filterText))
    : persons

  const filterChangeHandler = (event) => {
    setNewFilter(event.target.value)
  }

  const deleteNumber = (id) => {
    if (window.confirm('Do you really want to delete this entry?')) {
      phonebook
      .deletePerson(id)
      .then(() => {
        loadPersons()
        setNotifMessage(`Person deleted from phonebook`)
        setNotifType('green')
        setTimeout(() => {
          setNotifMessage(null)
        }, 3000);
      })
      .catch(error => {
        setNotifMessage('Person has already been deleted from phonebook')
        setNotifType('red')
        setTimeout(() => {
          setNotifMessage(null)
        }, 3000);
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMessage} type={notifType}/>
      <SearchFilter filterText={filterText} filterChangeHandler={filterChangeHandler}/>
      <AddNew
        submitHandler={submitHandler}
        newName={newName}
        nameChangeHandler={nameChangeHandler}
        newPhone={newPhone}
        phoneChangeHandler={phoneChangeHandler}
      />
      <Numbers
        personsToShow={personsToShow}
        deleteNumber={deleteNumber}
      />
    </div>
  )
}

export default App