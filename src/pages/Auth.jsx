import React, { useContext, useState } from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'
import loginImg from '../assets/login.png'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import {loginAPI, registerAPI} from '../services/allAPI'
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import { tokenAuthContext } from '../contexts/AuthContext'



const Auth = ({insideRegister}) => {
  const {isAuthorised,setIsAuthorised} = useContext(tokenAuthContext)
  const [isLoggedin,setIsLoggedin] = useState(false)
  const [userData,setUserData] = useState({
    username:"",email:"",password:""
  })
  console.log(userData);
  const navigate =useNavigate()

  const handleRegister = async (e) =>{
    e.preventDefault()
    if(userData.username && userData.email && userData.password){
       try{
        const result = await registerAPI(userData)
        console.log(result);
      if(result.status==200){
        toast.warning(`warning ${result?.data?.username}...please login to explore our website!!!`)
        setUserData({username:"",email:"",password:""})
        navigate('/login')
       }else{
        if(result.response.status==406){
          toast.error(result.response.data)
          setUserData({username:"",email:"",password:""})
        }
       }
    }catch(err){
      console.log(err);
    }
  }
  }


 const handleLogin = async (e)=>{
  e.preventDefault()
  if(userData.email && userData.password){
    //api call
     try{
       const result = await loginAPI(userData)
       console.log(result);
       if(result.status==200){
        setIsLoggedin(true)
        sessionStorage.setItem("user",JSON.stringify(result.data.user))
        sessionStorage.setItem("token",result.data.token)
        setIsAuthorised(true)
        setUserData({
          username:"",email:"",password:""
        })
        setTimeout(()=>{
          setUserData({
            username:"",email:"",password:""
          })
          setIsLoggedin(false)
          navigate('/')
        },2000);
       }else{
        if(result.response.status==404){
          toast.error(result.response.data)
        }
       }
     }catch(err){
      console.log(err);
     }
  }else{
    toast.info("please fill the form completly!!!")
  }
 }


  return (
    <div style={{width:'100%',height:'100vh'}} className='d-flex justify-content-center align-items-center'>
     <div className="container w-75">
      <div className="card shadow p-2">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <img className='w-100' src={loginImg} alt="login" />
          </div>
          <div className="col-lg-6">
            <h1 className='fw-bolder mt-2'><i class="fa-brands fa-docker mt-4 me-1"></i>Project Fair</h1>
            <h5 className='fw-bolder mt-2'>sign{insideRegister?"Up":"In"} to your Account
            </h5>
            <Form>
            {
              insideRegister &&
              <FloatingLabel controlId="floatingInputname"label="username" className="mb-3">
            <Form.Control value={userData.username} onChange={e=>setUserData({...userData,username:e.target.value})} type="text" placeholder="username" />
            </FloatingLabel>
            }
              <FloatingLabel controlId="floatingInput"label="Email address" className="mb-3">
            <Form.Control value={userData.email} onChange={e=>setUserData({...userData,email:e.target.value})} type="email" placeholder="name@example.com" />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control value={userData.password} onChange={e=>setUserData({...userData,password:e.target.value})}  type="password" placeholder="Password"/>
            </FloatingLabel>
            {
              insideRegister ?
               <div className="mt-3">
                <button onClick={handleRegister} className='btn btn-primary mb-2'>Register</button>
                <p>Already have an Account? Click here to <Link to="/login">Login</Link></p>
               </div>
              :
              <div className="mt-3">
                <button onClick={handleLogin} className='btn btn-primary mb-2 d-flex'>Login
                {
                  isLoggedin &&
                  <Spinner animation="border" className='ms-1' variant="info" />
                  }
                </button>
                
                <p>Already have an Account? Click here to <Link to="/register">Register</Link></p>
               </div>
            }
            
            </Form>
          </div>
        </div>
      </div>
     </div>
     <ToastContainer position='top-center' theme='colored' autoClose={3000}/>
    </div>
  )
}

export default Auth