import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { fetchUser, saveUser } from '../actions/userActions';
import '../css/main.css';

interface User {
  id?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  password?: string;
}

interface RootState {
  users: User;
}

type AppDispatch = (action: object) => void;

const Signup = () => {
  const dispatch = useDispatch() as AppDispatch;
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  
  const users = useSelector((state: RootState) => state.users);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (id) {
      const action = fetchUser(id) as object;
      dispatch(action);
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (users) {
      setFirstname(users.firstname || '');
      setLastname(users.lastname || '');
      setUsername(users.username || '');
      setEmail(users.email || '');
      setPassword(users.password || '');
    }
  }, [users]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    switch (name) {
      case 'firstname':
        setFirstname(value);
        break;
      case 'lastname':
        setLastname(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
    }
  }, []);

  const save = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const queryParams = new URLSearchParams(location.search);
    queryParams.get('id');
    
    const action = saveUser({
      id: users?.id,
      firstname,
      lastname,
      username,
      email,
      password,
    }) as object;
    
    await dispatch(action);
  }, [dispatch, location.search, users?.id, firstname, lastname, username, email, password]);

  return (
    <article className="signupForm">
      <section className="wrapper">
        <h3>Sign Up</h3>

        <form method="POST" onSubmit={save}>
          <fieldset>
            <label htmlFor="login-firstname">
              Firstname
              <input
                id="login-firstname"
                type="text"
                name="firstname"
                value={firstname}
                onChange={handleInputChange}
              />
            </label>

            <label htmlFor="login-lastname">
              Lastname
              <input
                id="login-lastname"
                type="text"
                name="lastname"
                value={lastname}
                onChange={handleInputChange}
              />
            </label>

            <label htmlFor="login-username">
              Username
              <input
                id="login-username"
                type="text"
                name="username"
                value={username}
                onChange={handleInputChange}
              />
            </label>

            <label htmlFor="login-email">
              Email
              <input
                id="login-email"
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
              />
            </label>

            <label htmlFor="login-password">
              Password
              <input
                id="login-password"
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
              />
            </label>
          </fieldset>

          <input
            id="submitQ1"
            className="submit"
            type="submit"
            value="Submit"
          />
        </form>
      </section>
    </article>
  );
};

export default Signup;