import Mainroutes from './routes/Mainroutes'
import './App.css'
import Nav from "./components/Nav"
import Player from './components/Player'

function App() {
 
  return (
   <div className="Main">
  <div className="nav-section">
    <Nav />
  </div>

  <div className="main-section">
    <Mainroutes/>
    <Player/>
   </div>
</div>
)
}


export default App