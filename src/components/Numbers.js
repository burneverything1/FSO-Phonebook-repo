import React from 'react'

const Number = ({ personEntry, deleteNumber }) => {
    return(
        <li>{personEntry.name}, {personEntry.phone}
        <button onClick={deleteNumber}>delete</button>
        </li>
    )
}

const Numbers = ({ personsToShow, deleteNumber }) => {

    return (
        <>
            <h2>Numbers</h2>
            <ul>
                {personsToShow.map(person =>
                <Number
                    key={person.name}
                    personEntry={person}
                    deleteNumber={() => deleteNumber(person.id)}
                />
                )}
            </ul>
        </>
    )
}

export default Numbers