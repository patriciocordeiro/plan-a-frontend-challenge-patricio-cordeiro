import './Home.css';

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Button from '../../shared/components/Button';
import { logout } from '../auth/authSlice';
import MovieScreen from '../movie/MovieScreen';

function HomeScreen() {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch(logout());
    history.push('/login');
  };

  return (
    <div>
      <header className='Home-header-container '>
        <div>Movie App</div>
        <div>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      <div>{<MovieScreen />}</div>
    </div>
  );
}

export default HomeScreen;
