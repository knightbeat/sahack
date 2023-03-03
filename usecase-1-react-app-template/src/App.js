// import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import './App.css';
import './App.scss';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter, Routes, Route, redirect } from 'react-router-dom';

import { useAuthContext } from "@asgardeo/auth-react";

import Catalog from './components/Catalog/Catalog.js';
import MyCart from './components/MyCart/Cart.js';
import Admin from './components/Admin/Admin.js';

// Component to render the login/signup/logout menu
const RightLoginSignupMenu = ({ onLogins, signOut, authState }) => {

  // Host the menu content and return it at the end of the function
  let menu;

  // Conditionally render the following two links based on whether the user is logged in or not
  if (authState.isAuthenticated) {
    menu = <>
      <Nav>
        <Nav.Link onClick={() => signOut()}>Logout</Nav.Link>
        <Nav.Link href="#deets"><FontAwesomeIcon icon={faUser} /></Nav.Link></Nav>
    </>
  } else {
    menu = <>
      <Nav>
        <Nav.Link onClick={() => onLogins()}>Login</Nav.Link>
        <Nav.Link href="#deets">Sign Up</Nav.Link></Nav>
    </>
  }
  return menu;
}

// Component to render the navigation bar
const PetStoreNav = ({ onLogin, signOut, user, authState }) => {

  useEffect(() => {

  }, [authState.isAuthenticated]);

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">PetStore</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {user.isAdmin ? null : <Nav.Link href="/">Catalog</Nav.Link>}
              {user.isAdmin ? null : <Nav.Link href="/mycart">My Cart</Nav.Link>}
              {user.isAdmin ? <Nav.Link href="/admin">Admin</Nav.Link> : null}
            </Nav>
          </Navbar.Collapse>
          <RightLoginSignupMenu
            onLogins={() => onLogin()}
            signOut={signOut}
            authState={authState} />
        </Container>
      </Navbar>
    </>
  );
};

const createProduct = async (product, token) => {
  const response = await fetch('https://3c3aa482-0d52-481b-be77-908c29195403-dev.e1-eu-north-azure.choreoapis.dev/wcsg/petshopapi/1.0.0/product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(product),
  });
  return response.json();
};

const modifyProduct = async (product, token) => {
  const response = await fetch('https://3c3aa482-0d52-481b-be77-908c29195403-dev.e1-eu-north-azure.choreoapis.dev/wcsg/petshopapi/1.0.0/product', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(product),
  });
  return response.json();
};

const deleteProduct = async (product, token) => {
  const response = await fetch(`https://3c3aa482-0d52-481b-be77-908c29195403-dev.e1-eu-north-azure.choreoapis.dev/wcsg/petshopapi/1.0.0/product?id=${product.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
  });
  return response.json();
};

// Main app component
const App = () => {
  // get the auth context and destructure the required methods
  const { state, signIn, signOut, getBasicUserInfo, getAccessToken } = useAuthContext();

  // declare state variable to store if the user is an admin
  const [isAdmin, setIsAdmin] = useState(false);

  // declare state variable to store the user
  const [user, setUser] = useState({});

  // declare state variable to store the access token
  const [accessToken, setAccessToken] = useState("");

  // declare state variable to store the Items in the catalog
  const [items, setItems] = useState([]);

  // clean up
  const [currentProduct, setCurrentProduct] = useState({});

  useEffect(() => {
    document.title = 'PetStore';

    // set isLoggedIn state variable to true if the user is logged in
    //setIsLoggedIn(state.isAuthenticated);

    // get AccssToken from AuthContext and set it to state
    getAccessToken().then((token) => {
      setAccessToken(token);

      // fetch catalog data from the backend and set it to state
      fetch('https://3c3aa482-0d52-481b-be77-908c29195403-dev.e1-eu-north-azure.choreoapis.dev/wcsg/petshopcatalog/1.0.0/petstore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: '{ "query": "{ all {id title description includes inc_for color material unit_price} }" }',
      })
        .then((response) => response.json())
        .then((data) => setItems(data.data.all))
        .catch((error) => console.error(error));

    }).catch((error) => {
      //console.error(error);
    });

    setBasicUserInfoInState();
  }, [isAdmin, state]);

  const handleSaveProduct = (product, e) => {
    console.log("handleSaveProduct");
    if (product.id == -1) {
      // create new product
      console.log("create new product");
      createProduct(product, accessToken).then((response) => {
        console.log(response);
      });
    } else {
      // update existing product
      console.log("update existing product");
      modifyProduct(product, accessToken).then((response) => {
        console.log(response);
      });
    }
  }

  const handleDeleteProduct = (product) => {
    console.log("handleDeleteProduct");
    const filteredItems = items.filter((item) => item.id !== product.id);
    setItems(filteredItems);
    if(product.id != -1){
      deleteProduct(product, accessToken).then((response) => {
        console.log(response);
      });
    }
  }

  const setBasicUserInfoInState = () => {
    getBasicUserInfo().then((response) => {
      var user = { ...response }
      var groups = response.groups;
      if (groups.includes("PetstoreAppAdmin")) {
        user.isAdmin = true;
      } else {
        user.isAdmin = false;
      }
      setUser(user);
    }).catch((error) => {
      console.error(error);
      setIsAdmin(false);
    });

  };

  return (
    <>
      <PetStoreNav
        user={user}
        onLogin={() => signIn()}
        signOut={signOut}
        authState={state} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user.isAdmin ? <Admin items={items} onSaveProduct={handleSaveProduct} onDeleteProduct={handleDeleteProduct}/> : <Catalog items={items} />} />
          <Route path="/mycart" element={<MyCart />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
