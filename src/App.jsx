import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from './supabase'

const App = () => {
  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [currentTodo, setCurrentTodo] = useState({})

  useEffect(() => {
    const fetchTodos = async () => {
      const {data} = await supabase.from('todos').select('*').order('created_at')
      setTodos(data || [])
    }
    fetchTodos()
  }, [])

  function handleInputChange(e) {
    setTodo(e.target.value);
  }

  async function handleFormSubmit(e) {

    e.preventDefault();

    if(todo.trim() !== ""){
      const {data, error} = await supabase.from('todos').insert([{ text: todo.trim() }]).select()
      console.log("data", data)
      console.log("error", error)
      if (data) {
        setTodos([...todos, data[0]])
      }
      
    }
    setTodo("");
  }

  async function handleDeleteClick(id) {
    await supabase.from('todos').delete().eq('id', id)
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  function handleEditClick(todo) {
    setIsEditing(true);
    setCurrentTodo({...todo})
  }

  function handleEditInputChange(e) {
    setCurrentTodo({ ...currentTodo, text: e.target.value})
    console.log("Current Todo ", currentTodo);
  }

  async function handleUpdateTodo(id, updatedTodo) {
    await supabase.from('todos').update({ text: updatedTodo.text}).eq('id', id)
    setTodos(todos.map((todo) => todo.id === id ? updatedTodo : todo))

    setIsEditing(false);
  }

  function handleEditFormSubmit(e) {
    e.preventDefault();

    handleUpdateTodo(currentTodo.id, currentTodo);
  }

  console.log(todos);

  return (
    <div className='container'>
      <h1>Todo List</h1>

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
