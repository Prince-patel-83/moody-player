import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useContext } from 'react';
import { songcontext } from '../Wrapper.jsx';

const Login = lazy(() => import('../pages/Login.jsx'));
const Register = lazy(() => import('../pages/Register.jsx'));
const Search = lazy(() => import('../pages/Search.jsx'));
const Fav = lazy(() => import('../pages/Fav.jsx'));
const PageNotFound = lazy(() => import('../pages/PageNotFound.jsx'));
const Home = lazy(() => import('../pages/Home.jsx'));
const Upload = lazy(() => import('../pages/Upload.jsx'));
const Profile = lazy(() => import('../pages/Profile.jsx'));


const Mainroutes = ()=>{

  const {userData} = useContext(songcontext);
  console.log("masin " , userData);
  
  return (
    <Routes>
        {/* common routes */}
        <Route path='/' element= { <Home/> }/>
        <Route path='/search' element= {<Search/>}/>
        <Route path='*' element= {<PageNotFound/>}/>
  

      {userData ? 
      // authroutes means user logged in
      <> 
        <Route path='/profile' element= { <Profile/> }/>
        <Route path='/playlists' element= { <Fav/> }/>
        {userData.IsAdmin ? <Route path='/create-song' element= {<Upload/>}/> : ""}
        
      </> :
//     user not logged in
       <>

        <Route path='/register' element= { 

          <Register/> 

        }/>
        <Route path='/login' element= { 

          <Login/> 

        }/>
       
       </>}
       
    </Routes>
  )
}

export default Mainroutes