import { ADD_TO_CART, REMOVE_ITEM, SUB_QUANTITY, ADD_QUANTITY, ADD_SHIPPING, SUB_SHIPPING } from '../actions/motocartActionsTypes';
import Item1 from './images/item1.jpg';
import Item2 from './images/item2.jpg';
import Item3 from './images/item3.jpg';
import Item4 from './images/item4.jpg';
import Item5 from './images/item5.jpg';
import Item6 from './images/item6.jpg';

interface CartItem {
  id: number;
  title: string;
  desc: string;
  price: number;
  quantity: number;
  img: string;
}

interface CartState {
  items: CartItem[];
  addedItems: CartItem[];
  total: number;
}

interface CartAction {
  type: string;
  id?: number;
}

const initState: CartState = {
  items: [
    { id: 1, title: 'Batman #497', desc: 'VG Condition', price: 10, quantity: 1, img: Item1 },
    { id: 2, title: 'Superman #75', desc: 'NM Condition', price: 21, quantity: 1, img: Item2 },
    { id: 3, title: 'Captain America #25 Vol. 2', desc: 'NM Condition', price: 43, quantity: 1, img: Item3 },
    { id: 4, title: 'Spider-Man #700', desc: 'Mint Condition', price: 16, quantity: 1, img: Item4 },
    { id: 5, title: 'Spawn #1', desc: 'Fine Condition', price: 10, quantity: 1, img: Item5 },
    { id: 6, title: 'The Maxx #2', desc: 'VG Condition', price: 6, quantity: 1, img: Item6 }
  ],
  addedItems: [],
  total: 0
};

const motocartReducer = (state = initState, action: CartAction): CartState => {
  switch (action.type) {
    case ADD_TO_CART: {
      const addedItem = state.items.find(item => item.id === action.id);
      if (!addedItem) return state;

      const existedItem = state.addedItems.find(item => item.id === action.id);

      if (existedItem) {
        addedItem.quantity += 1;
        return {
          ...state,
          total: state.total + addedItem.price
        };
      } else {
        addedItem.quantity = 1;
        return {
          ...state,
          addedItems: [...state.addedItems, addedItem],
          total: state.total + addedItem.price
        };
      }
    }

    case REMOVE_ITEM: {
      const itemToRemove = state.addedItems.find(item => item.id === action.id);
      if (!itemToRemove) return state;

      const newItems = state.addedItems.filter(item => item.id !== action.id);
      const newTotal = state.total - (itemToRemove.price * itemToRemove.quantity);

      return {
        ...state,
        addedItems: newItems,
        total: newTotal
      };
    }

    case ADD_QUANTITY: {
      const addedItem = state.items.find(item => item.id === action.id);
      if (!addedItem) return state;

      addedItem.quantity += 1;
      return {
        ...state,
        total: state.total + addedItem.price
      };
    }

    case SUB_QUANTITY: {
      const addedItem = state.items.find(item => item.id === action.id);
      if (!addedItem) return state;

      if (addedItem.quantity === 1) {
        const newItems = state.addedItems.filter(item => item.id !== action.id);
        return {
          ...state,
          addedItems: newItems,
          total: state.total - addedItem.price
        };
      } else {
        addedItem.quantity -= 1;
        return {
          ...state,
          total: state.total - addedItem.price
        };
      }
    }

    case ADD_SHIPPING:
      return {
        ...state,
        total: state.total + 6
      };

    case SUB_SHIPPING:
      return {
        ...state,
        total: state.total - 6
      };

    default:
      return state;
  }
};

export default motocartReducer;