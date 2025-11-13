/* Magnanimous Comic Book Shop
Author/Developer:  Douglas T. Angram
WDD-469 Project & Portfolio - Full Sail University
Source:  motoShopMenu.js
*/

import { Link } from 'react-router-dom'

const motoshopMenu = () => {
  return (
    <header>
      <nav className="nav-wrapper">
        <article className="container">
          <section>
            <Link to="/"><figure><img src="MCB_Logo.png" className="brand-logo" alt="MCB Logo"></img></figure></Link>
            <Link to="/"><h1 className="brand-title">Magnanimous Comic Book Shop</h1></Link>
          </section>

          <ul className="right">
              <li><Link to="/">Browse</Link></li>
              <li><Link to="/motoCart"><i className="material-icons">shopping_cart</i></Link></li>
              <li><Link to="/motoCart">Moto-Cart</Link></li>
              {
                // <li><Link to="/signup">Signup</Link></li>
              }
          </ul>

          <ul id="nav-mobile" className="sidenav">
              <li><a href="/">Home</a></li>
              <li><a href="/motoCart">Browse</a></li>
              <li><a href="/motoCart">Moto-Cart</a></li>
              {
                // <li><a href="/signup">Signup</a></li>
              }
          </ul>
          <a href="/" data-target="nav-mobile" className="sidenav-trigger"><i className="material-icons">menu</i></a>
        </article>
      </nav>
    </header>
  )
}

export default motoshopMenu;
