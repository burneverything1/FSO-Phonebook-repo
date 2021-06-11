import React from 'react'

const AddNew = ({ submitHandler, newName, nameChangeHandler, newNumber, numberChangeHandler }) => {
    return (
        <>
            <h2>Add a new</h2>
            <form onSubmit={submitHandler}>
            <div>name:
            <input value={newName} onChange={nameChangeHandler}/>
            </div>
            <div>number:
            <input value={newNumber} onChange={numberChangeHandler}/>
            </div>
            <div>
            <button type="submit">add</button>
            </div>
            </form>
        </>
    )
}

export default AddNew