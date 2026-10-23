import Mainroutes from './routes/Mainroutes'
import './App.css'
import Nav from "./components/Nav"
import AuthWrapper from './routes/AuthWrapper'

function App() {
 
  return (
   <div className="Main">
  <div className="nav-section">
    <Nav />
  </div>

  <div className="main-section">
    <Mainroutes/>
   </div>
</div>
)
}


export default App