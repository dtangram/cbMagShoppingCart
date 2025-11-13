/* Magnanimous Comic Book Shop
Author/Developer:  Douglas T. Angram
WDD-469 Project & Portfolio - Full Sail University
Source:  ShippingTotal.tsx
*/
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addShipping, subtractShipping } from '../actions/motocartActions';

interface RootState {
  addedItems: Array<object>;
  total: number;
}

const ShippingTotal = () => {
  const dispatch = useDispatch();
  const total = useSelector((state: RootState) => state.total);
  const [isShippingChecked, setIsShippingChecked] = useState(false);

  useEffect(() => {
    return () => {
      if (isShippingChecked) {
        dispatch(subtractShipping());
      }
    };
  }, [isShippingChecked, dispatch]);

  const handleChecked = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsShippingChecked(checked);
    
    if (checked) {
      dispatch(addShipping());
    } else {
      dispatch(subtractShipping());
    }
  }, [dispatch]);

  return (
    <div className="container">
      <div className="collection">
        <li className="collection-item">
          <label>
            <input 
              type="checkbox" 
              checked={isShippingChecked}
              onChange={handleChecked} 
            />
            <span>Shipping(+$6)</span>
          </label>
        </li>
        <li className="collection-item">
          <b>Total: ${total}</b>
        </li>
      </div>
      <div className="checkout">
        <button className="waves-effect waves-light btn">Checkout</button>
      </div>
    </div>
  );
};

export default ShippingTotal;