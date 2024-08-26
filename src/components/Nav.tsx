import { Link } from 'react-router-dom';

export function Nav() {
  
    return (
      <div className='nav-container'>
      <Link to="/transferxi" className="nav-game">
        <div className='nav-title'>Transfer XI</div>
        <div className='nav-desc'>Put together the highest value starting XI</div>
      </Link>

      <Link to="/fiveaside" className="nav-game">
        <div className='nav-title'>Five-A-Side</div>
        <div className='nav-desc'>Pick the best players to beat the opposing team</div>
      </Link>

      <Link to="/blindrank" className="nav-game">
        <div className='nav-title'>Blind Rank</div>
        <div className='nav-desc'>Rank 5 players without knowing what comes next</div>
      </Link>

      <Link to="/whoscored" className="nav-game">
        <div className='nav-title'>Who Scored?</div>
        <div className='nav-desc'>Guess who scored the goal based on the video</div>
      </Link>
    </div>
    );
  }