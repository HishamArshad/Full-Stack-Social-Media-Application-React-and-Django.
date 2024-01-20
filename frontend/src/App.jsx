 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import { useState, createContext } from 'react';
import NewLogin from './components/NewLogin';
import Complete from './components/Complete';
import Home from './components/Home';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import { CountContext } from './components/CountContext';
import { useObservable } from '@legendapp/state/react';
import CreatePost from './components/CreatePost';
import ContextApi from './context';
import YourPost from './components/YourPost';
function App() {
  
  const states = useObservable({
    bool: false
  })
  
  return (
    <>   
 <ContextApi>
	<Router>
    {/* <Navbar isLoggedOut={isLoggedOut}/>
  */}
  <Navbar />
    <Routes>
		<Route path='/login' element={<LoginForm/>} />
		<Route path='/'element={<Home />} />
		<Route path='/createpost'element={<CreatePost />} />
		<Route path='/yourpost'element={<YourPost />} />
 
    </Routes>
  </Router>
  </ContextApi>

    </>
  );
}

export default App;
 