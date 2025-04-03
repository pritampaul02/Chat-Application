import React from 'react';
import InputBox from './components/ui/InputBox';
import {BrowserRouter,Routes, Route} from "react-router-dom"
import{ Login} from "./pages/Login"
import Register from './pages/Register';
import Chat from './pages/Chat';
import { Settings } from './pages/Settings';
import { Search } from './pages/Search';
import { Status } from './pages/Status';

const App = () => {
     return (
          <BrowserRouter>
          <Routes>
               <Route path='/login' element = {<Login/>}/>
               <Route path='/register' element = {<Register/>}/>
               <Route path='/chat' element = {<Chat/>}/>
               <Route path='/setting' element = {<Settings/>}/>
               <Route path='/search' element = {<Search/>}/>
               <Route path='/status' element = {<Status/>}/>
              

          </Routes>
          </BrowserRouter>
     )
};

export default App;
