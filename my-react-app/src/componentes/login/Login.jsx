import React from 'react'
import { useState } from 'react'
import './Login.css'


const Login = () => {
  const[Username,setUsername]=useState("")
  const[Password,setPassword]=useState("")

  const handleSubmit =(event) =>{
   
    console.log(Username+" "+Password)
    event.preventDefault()
  }
  const sayHello = () => {
    console.log('Oi');
  };

  return (
   
    <div className='container'>
      <div onClick={sayHello} className='psbt'><button className='bt'>sair</button></div>
    
      <form onSubmit= {handleSubmit}>
        <div><h1>Acessoa ao Sistema</h1></div>
        <div className='entradas'>
        <input type="email" placeholder='email' onChange={(e) => setUsername(e.target.value)} />
        
        </div>
        <div className='entradas'>
        <input type="password" placeholder='Senha' onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className='recall-forget'>
         <div className='checbox'>
          <input type="checkbox" />lembrar de min <a href="">esqueçeu a senha?</a> 
          
         </div>
          
        </div>
        <button>Acessar</button>
        <div className='signup-link'>
          <p>
            não tem uma conta? <a href="#">registrar</a>
          </p>
        </div>
      </form>
    </div>
   
  )
}

export default Login;
