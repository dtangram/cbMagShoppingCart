import API from '../API';
import {
  SET_USER,
  ADD_USER,
  REMOVE_USER,
} from './motocartActionsTypes';

interface User {
  id?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  password?: string;
  quizId?: string;
}

interface UserAction {
  type: string;
  user?: User;
  id?: string;
  userId?: string;
  [key: string]: string | User | undefined;
}

type AppDispatch = (action: UserAction) => void;
type GetState = () => object;

export const fetchUser = (id: string) => async (dispatch: AppDispatch, getState: GetState) => {
  const state = getState() as { users: { byId: { [key: string]: User } } };
  const existinguser = state?.users?.byId?.[id];
  
  if (existinguser) return;
  
  const response = await API.get(`/users/${id}`);
  const user = response.data;
  
  dispatch({ type: SET_USER, user });
};

export const saveUser = (user: User) => async (dispatch: AppDispatch) => {
  if (user.id) {
    const response = await API.put(`/users/${user.id}`, user);
    const updateduser = response.data;
    
    dispatch({ type: SET_USER, user: { ...user, ...updateduser } });
  } else {
    const response = await API.post('/users', user);
    const newuser = response.data;
    
    dispatch({ type: SET_USER, user: { ...user, ...newuser } });
    dispatch({ type: ADD_USER, id: newuser.id, quizId: user.quizId });
  }
};

export const deleteUser = (id: string) => async (dispatch: AppDispatch) => {
  await API.delete(`/users/${id}`);
  
  dispatch({ type: REMOVE_USER, id });
};