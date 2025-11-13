import { ADD_TO_CART, REMOVE_ITEM, SUB_QUANTITY, ADD_QUANTITY, ADD_SHIPPING, SUB_SHIPPING } from './motocartActionsTypes';

interface CartAction {
  type: string;
  id?: number;
  [key: string]: string | number | undefined;
}

export const addToCart = (id: number): CartAction => {
  return {
    type: ADD_TO_CART,
    id
  };
};

export const removeItem = (id: number): CartAction => {
  return {
    type: REMOVE_ITEM,
    id
  };
};

export const subtractQuantity = (id: number): CartAction => {
  return {
    type: SUB_QUANTITY,
    id
  };
};

export const addQuantity = (id: number): CartAction => {
  return {
    type: ADD_QUANTITY,
    id
  };
};

export const addShipping = (): CartAction => {
  return {
    type: ADD_SHIPPING
  };
};

export const subtractShipping = (): CartAction => {
  return {
    type: SUB_SHIPPING
  };
};