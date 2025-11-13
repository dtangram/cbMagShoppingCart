/* Magnanimous Comic Book Shop
Author/Developer:  Douglas T. Angram
WDD-469 Project & Portfolio - Full Sail University
Source:  Home.tsx
*/
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../actions/motocartActions';

interface Item {
  id: number;
  img: string;
  title: string;
  desc: string;
  price: number;
}

interface RootState {
  items: Item[];
}

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state: RootState) => state.items);

  const handleAddToCart = useCallback((event: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    event.preventDefault();
    dispatch(addToCart(id));
    navigate('/motoCart');
  }, [dispatch, navigate]);

  if (!items || items.length === 0) {
    return (
      <article className="container">
        <h2 className="center">On Sale - Limited Time Offer!</h2>
        <section className="box">
          <article className="card">
            <section className="card-content center">
              <p>No items available at this time.</p>
            </section>
          </article>
        </section>
      </article>
    );
  }

  return (
    <article className="container">
      <h2 className="center">On Sale - Limited Time Offer!</h2>
      <section className="box">
        {items.map((item) => {
          const { id, img, title, desc, price } = item;
          
          return (
            <article className="card" key={id}>
              <section className="card-image">
                <figure>
                  <img src={img} alt={title} />
                </figure>
                <Link to="/motoCart" onClick={(event) => handleAddToCart(event, id)}>
                  <span className="btn-floating halfway-fab waves-effect waves-light blue">
                    <i className="material-icons">add</i>
                  </span>
                </Link>
              </section>
              <section className="card-content">
                <span className="card-title">{title}</span>
                <p>{desc}</p>
                <p><b>Price: ${price}</b></p>
              </section>
            </article>
          );
        })}
      </section>
    </article>
  );
};

export default Home;