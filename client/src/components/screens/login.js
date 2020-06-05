import React,{useState,useContext, createContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Signin=()=>{
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password,setPasword] = useState("")
    const [email,setEmail] = useState("")
    const PostData =()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            return
        }
        if(password.length<6){
            M.toast({html: "Length of password should be more than 6 character",classes:"#c62828 red darken-3"})
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                
                password,
                email,
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if (data.error){
                M.toast({html: data.error,classes:"#f44336 red"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"signedin success",classes:"#43a047 green darken-1"})
                history.push('/')
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
            <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e)=>setPasword(e.target.value)}
            />
                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                onClick={()=>PostData()}
                >Login
                </button>
                <h5>
            <Link to="/signup">Don't have an account ?</Link>
            </h5>
            </div>
        </div>
    )
}

export default Signin;