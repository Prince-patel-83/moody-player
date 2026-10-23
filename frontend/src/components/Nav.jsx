
import { NavLink } from "react-router-dom";
import "./Nav.css"
import { useContext, useEffect } from "react";
import  {songcontext} from "../Wrapper";


const Nav = () => {
  const { userData } = useContext(songcontext);
  // true = user is NOT logged in
  // false = user IS logged in
  let show = !userData ; 
  console.log(show , " bahar se hu" );

  const mainLinks = [
    { to: "/", label: "Home", icon: "ri-home-4-fill", end: true   },
    { to: "/search", label: "Search", icon: "ri-search-line" },
    { to: "/playlists", label: "Favourite", icon: "ri-heart-3-fill"  , show  : show},
    { to: "/create-song", label: "Create", icon: "ri-upload-cloud-fill", create: true , show : (show || !userData?.IsAdmin)  },
  ];

  const accountLinks = [
    { to: "/profile", label: "Profile", icon: "ri-user-3-fill"  , show : show },
    { to: "/login", label: "Login", icon: "ri-user-add-fill"  , show : !show },
  ];

  const renderLink = (item) =>{ 
    
   return !item.show &&  (
       <NavLink
      key={item.to}
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `link ${isActive ? "active" : ""} ${
          item.create ? "create-song" : ""
        }`
      }
    >
      <span className="nav-link-icon">
        <i className={item.icon}></i>
      </span>

      <span className="nav-link-label">{item.label}</span>

      {item.create && (
        <span className="nav-create-badge">
          <i className="ri-add-line"></i>
        </span>
      )}
    </NavLink> )
    
    }

  return (
    <nav className="Nav">
      {/* Brand */}
      <div className="nav-brand">
        <div className="upload-song-brand-icon">
          <i className="ri-music-2-fill"></i>
        </div>

        <div className="nav-brand-text">
          <h2>moody<span>.</span></h2>
          <p>YOUR MUSIC SPACE</p>
        </div>
      </div>

      {/* Main navigation */}
      <div className="nav-menu">
        <span className="nav-section-label">MENU</span>

        <div className="nav-links">
          {mainLinks.map(renderLink)}
        </div>
      </div>

      {/* Bottom account section */}
      <div className="nav-bottom">
        <div className="nav-bottom-decoration">
          <i className="ri-sparkling-2-fill"></i>
          <span className="nav-link-label">
            Your mood, your music.
          </span>
        </div>

        <div className="nav-account-links">
          {accountLinks.map(renderLink)}
        </div>

        <div className="nav-footer">
          <span className="nav-footer-dot"></span>
          <span className="nav-link-label">
            Made for your mood
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Nav;