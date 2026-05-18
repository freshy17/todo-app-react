import { useState, useEffect } from 'react'
import './App.css'

const App = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");

    if(savedTodos) {
      return JSON.parse(savedTodos)
    }else {
      return [];
    }
  })
  const [todo, setTodo] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [currentTodo, setCurrentTodo] = useState({})

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos])

  function handleInputChange(e) {
    setTodo(e.target.value);
  }

  function handleFormSubmit(e) {

    e.preventDefault();

    if(todo.trim() !== ""){
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: todo.trim()
        }
      ])
    }
    setTodo("");
  }

  function handleDeleteClick(id) {
    const removeItem = todos.filter((todo) => {
      return todo.id !== id
    })

    setTodos(removeItem);
  }

  function handleEditClick(todo) {
    setIsEditing(true);
    setCurrentTodo({...todo})
  }

  function handleEditInputChange(e) {
    setCurrentTodo({ ...currentTodo, text: e.target.value})
    console.log("Current Todo ", currentTodo);
  }

  function handleUpdateTodo(id, updatedTodo) {
    const updatedItem = todos.map((todo) => {
      return todo.id === id ? updatedTodo : todo;
    })

    setIsEditing(false);
    setTodos(updatedItem);
  }

  function handleEditFormSubmit(e) {
    e.preventDefault();

    handleUpdateTodo(currentTodo.id, currentTodo);
  }

  console.log(todos);

  return (
    <div className='container'>
      <h1>Todo App</h1>

      {isEditing ? (
        <form onSubmit={handleEditFormSubmit}> 
          <input 
            type="text"
            name='editTodo' 
            placeholder='Edit todo'
            value={currentTodo.text}
            onChange={handleEditInputChange}
          />

          <button className='update' type='submit'>Update</button>
          <button className='cancel' onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : 
      <form onSubmit={handleFormSubmit}>
        <input 
          type="text" 
          name='todo'
          placeholder='Create a new todo'
          value={todo}
          onChange={handleInputChange}
        />
        {" "}
        <button className='add' type='submit'>Add</button>
      </form>
      }

      <ul className='todo-list'>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            {" "}
            <button className='edit' onClick={() => handleEditClick(todo)}>Edit</button> 
            <button className='delete' onClick={() => handleDeleteClick(todo.id)}>X</button>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default App
