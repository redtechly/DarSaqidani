import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { signout } from '../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';


export default function NavBar() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };
  return (
    <div>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="/">Saqidani</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <NavDropdown.Item href="/profile"> User Profile </NavDropdown.Item>
                  <NavDropdown.Item href="/orderhistory">
                    Order History
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/" onClick={signoutHandler}>
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>) : (
                <Nav.Link href="signin"> Sign In </Nav.Link>
              )}
              {userInfo && userInfo.isSeller && (
                <NavDropdown title="الــمـطـعـم" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/productlist/seller">
                    المنيو
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/orderlist/seller">
                    الطلبات
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {userInfo && userInfo.isAdmin && (

                <NavDropdown title="Admin" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/dashboard"> Dashboard </NavDropdown.Item>
                  <NavDropdown.Item href="productlist">
                  Products
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/orderlist">Orders</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/userlist">
                    Users
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}
