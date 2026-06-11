import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from './supabase'
import Auth from './Auth'

const App = () => {
  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [currentTodo, setCurrentTodo] = useState({})

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode")
    return saved === "true"
  })

  useEffect(() => {

    if(!session) return 

    const fetchTodos = async () => {
      setLoading(true)
      const {data, error} = await supabase.from('todos').select('*').order('created_at')
      console.log("fetch data: ", data)
      console.log("fetch error: ", error)
      setTodos(data || [])
      setLoading(false)
    }
    fetchTodos()
  }, [session])

  useEffect(() => {
    //เช็ค session ตอนเปิดหน้าเว็บ
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session)
    })
    //คอยฟังว่า login/logout เมื่อไหร่
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)

    if(darkMode) {
      document.body.classList.add('dark-body')
    } else {
      document.body.classList.remove('dark-body')
    }
  }, [darkMode])

  function handleInputChange(e) {
    setTodo(e.target.value);
  }

  async function handleFormSubmit(e) {

    e.preventDefault();

    if(todo.trim() !== ""){
      const {data, error} = await supabase
        .from('todos')
        .insert([{ 
          text: todo.trim(), 
          user_id: session.user.id 
        }])
        .select()
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

  // console.log(todos);

  if(!session) return (
    <Auth darkMode={darkMode}/>
  )

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <h1>Todo List</h1>

      <p>เข้าสู่ระบบด้วย: {session.user.email}</p>

      <button className='darkMode' onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️Light Mode" : "🌙Dark Mode"}
      </button>

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

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : (
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
      )}
     
    <button className='logout' onClick={() => supabase.auth.signOut()}>
        Logout
      </button>
    </div>
  )
}

export default App
