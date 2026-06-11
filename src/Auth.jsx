import { useState } from "react";
import { supabase } from "./supabase";

const Auth = ({darkMode}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLogin, setIsLogin] = useState(true)
    const [error, setError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        console.log("กด sumbit แล้ว")
        console.log("email: ", email)
        console.log("password: ", password)

        if(isLogin) {
            const {error} = await supabase.auth.signInWithPassword({email, password})
            console.log("login error: ", error)
            if(error) setError(error.message)
        } else {
            const {error} = await supabase.auth.signUp({email, password})
            console.log("register error: ", error)
            if(error) setError(error.message)  
        }
    }

    return (
        <div className={`container ${darkMode ? 'dark' : ''}`}>
            <h1>Todo List</h1>
            <h2>{isLogin ? "Login" : "Register"}</h2>

            <form onSubmit={handleSubmit} style={{flexDirection: "column", alignItems: "stretch"}}>
                <input 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{marginBottom: '5px'}}
                />
                
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{marginBottom: '5px'}}
                />
                <button className="add" type="submit">
                    {isLogin ? "Login" : "Register"}
                </button>
            </form>

            {/* && คือถ้า error มีค่าถึงจะแสดง เป็นเหมือน if ย่อๆ*/}
            {error && <p style={{color: "red"}}>{error}</p>}

            <p>
                {/* ถ้า isLogin เป็น true แสดงว่า 'ยังไม่มีบัญชีผู้ใช้' ถ้าไม่ใช่แสดง 'มีบัญชีแล้ว' */}
                {isLogin ? "ยังไม่มีบัญชี?" : "มีบัญชีแล้ว"}
                <button  className="login-logout btn" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Resgister" : "Login"}
                </button>
            </p>
        </div>
    )
}

export default Auth