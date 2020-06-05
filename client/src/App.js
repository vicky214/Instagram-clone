import React,{useEffect,createContext,useReducer,useContext} from 'react';
import NavBar from './components/navbar';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom';
import "./App.css";
import Home from './components/screens/home'
import Signin from './components/screens/login'
import Profile from './components/screens/profile'
import Signup from './components/screens/signup'
import Createpost from './components/screens/createpost'
import {reducer,initialState} from './reducer/userReducer'
import UserProfile from './components/screens/UserProfile'
import SubscribesUserPosts from './components/screens/SubscribesUserPosts'
export const UserContext = createContext()


const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      if(!history.location.pathname.startsWith('/reset'))
           history.push('/signin')
    }
  },[])
  return(
    <Switch>
    <Route exact path="/"><Home /></Route>
    <Route path="/signin"><Signin /></Route>
    <Route path="/signup"><Signup /></Route>
    <Route exact path="/profile"><Profile /></Route>
    <Route path="/createpost"><Createpost /></Route>
    <Route path="/profile/:userid"><UserProfile /></Route>
    <Route path="/myfollowerspost"><SubscribesUserPosts /></Route>
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <NavBar />
      <Routing />
      
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
