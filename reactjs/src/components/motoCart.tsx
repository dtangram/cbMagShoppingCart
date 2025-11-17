import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem, addQuantity, subtractQuantity } from '../actions/motocartActions';
import MotocartPreCheck from './motocartPreCheck';

interface CartItem {
  id: number;
  img: string;
  title: string;
  desc: string;
  price: number;
  quantity: number;
}

interface RootState {
  addedItems: CartItem[];
}

const MotoCart = () => {
  const dispatch = useDispatch();
  const addedItems = useSelector((state: RootState) => state.addedItems);

  const handleRemove = useCallback((id: number) => {
    dispatch(removeItem(id));
  }, [dispatch]);

  const handleAddQuantity = useCallback((id: number) => {
    dispatch(addQuantity(id));
  }, [dispatch]);

  const handleSubtractQuantity = useCallback((id: number) => {
    dispatch(subtractQuantity(id));
  }, [dispatch]);

  return (
    <div className="container">
      <div className="motoCart">
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <h5>Current Order Status:</h5>
        <ul className="collection">
          {addedItems && addedItems.length > 0 ? (
            addedItems.map((item) => {
              const { id, img, title, desc, price, quantity } = item;
              
              return (
                <li className="collection-item avatar" key={id}>
                  <div className="item-img">
                    <img src={img} alt={title} />
                  </div>
                  <div className="item-desc">
                    <span className="title">{title}</span>
                    <p>{desc}</p>
                    <p><b>Price: ${price}</b></p>
                    <p><b>Quantity: {quantity}</b></p>
                    <div className="add-remove">
                      <Link to="/motoCart">
                        <i className="material-icons" onClick={() => handleAddQuantity(id)}>
                          arrow_drop_up
                        </i>
                      </Link>
                      <Link to="/motoCart">
                        <i className="material-icons" onClick={() => handleSubtractQuantity(id)}>
                          arrow_drop_down
                        </i>
                      </Link>
                    </div>
                    <button 
                      className="waves-effect waves-light btn pink remove" 
                      onClick={() => handleRemove(id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })
          ) : (
            <p>Sorry, your Comic Book Cart is EMPTY.</p>
          )}
        </ul>
        <MotocartPreCheck />
      </div>
    </div>
  );
};

export default MotoCart;