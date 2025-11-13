import {
  SET_USER,
  ADD_USER,
  REMOVE_USER,
} from '../actions/motocartActionsTypes';
import {
  removeIdFromObject,
  removeIdFromArray,
} from '../utils/removeId';

interface User {
  id: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  password?: string;
  userId?: string;
}

interface UsersState {
  userLoadedAt: Record<string, number>;
  byUserId: Record<string, string[]>;
  byId: Record<string, User>;
}

interface UserAction {
  type: string;
  user?: User;
  id?: string;
  userId?: string;
}

const startState: UsersState = {
  userLoadedAt: {},
  byUserId: {},
  byId: {},
};

const usersReducer = (state = startState, action: UserAction): UsersState => {
  const { type, ...payload } = action;

  switch (type) {
    case SET_USER: {
      const { user } = payload;
      if (!user || !user.id) return state;

      return {
        ...state,
        byId: {
          ...state.byId,
          [user.id]: user,
        },
      };
    }

    case ADD_USER: {
      const { id, userId } = payload;
      if (!id || !userId) return state;

      const allIds = [...(state.byUserId[userId] || []), id];

      return {
        ...state,
        byUserId: {
          ...state.byUserId,
          [userId]: Array.from(new Set(allIds)),
        },
      };
    }

    case REMOVE_USER: {
      const { id } = payload;
      if (!id || !state.byId[id]) return state;

      const { userId } = state.byId[id];
      if (!userId) return state;

      return {
        ...state,
        byId: removeIdFromObject(id, state.byId) as Record<string, User>,
        byUserId: {
          ...state.byUserId,
          [userId]: removeIdFromArray(id, state.byUserId[userId]),
        },
      };
    }

    default:
      return state;
  }
};

export default usersReducer;