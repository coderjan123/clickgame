import React  from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/themes.css'
import Login from "./pages/Login";
import Register from "./pages/Register";
import Real_app from "./pages/Real_app";
import Wrapper from "./pages/Wrapper";
import Leaderboard from "./pages/Leaderboard"
function App() {
  
  return (
    
    <BrowserRouter  basename="/clickgame">
        <Routes>
           {/*home */}
            <Route
            path="/"
             element={
              <Wrapper>
            <Real_app/>
            </Wrapper>
          }/>


            {/*login */}
            <Route
            path='/Login'
            element={<Login/>}/>

            

             {/*register */}
            <Route
            path='/Register'
            element={<Register/>}/>
            <Route
            path='/Leaderboard'
            element={<Leaderboard/>}/>

         
            
        </Routes>
    </BrowserRouter>
  );
}

export default App;
