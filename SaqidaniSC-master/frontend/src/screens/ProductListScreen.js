import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import Table from 'react-bootstrap/Table';
import {
  createProduct,
  deleteProduct,
  listProducts,
} from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from '../constants/productConstants';

export default function ProductListScreen(props) {
  const navigate = useNavigate();
  const { pageNumber = 1 } = useParams();
  const { pathname } = useLocation();
  const sellerMode = pathname.indexOf('/seller') >= 0;
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      navigate(`/product/${createdProduct._id}/edit`);
    }
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
    dispatch(
      listProducts({ seller: sellerMode ? userInfo._id : '', pageNumber })
    );
  }, [
    createdProduct,
    dispatch,
    navigate,
    sellerMode,
    successCreate,
    successDelete,
    userInfo._id,
    pageNumber,
  ]);

  const deleteHandler = (product) => {
    if (window.confirm('Are you sure to delete?')) {
      dispatch(deleteProduct(product._id));
    }
  };
  const createHandler = () => {
    dispatch(createProduct());
  };
  return (
    <div>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

      {loadingCreate && <LoadingBox></LoadingBox>}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (

        <>
            &nbsp;
          <Row>
            
            <Col>
              <h1>الأصناف</h1>
            </Col>
            <Col>
              <h1> العدد :  {products.length}</h1>
            </Col>
            <Col className="col text-end">
              <div>
                <Button type="button" variant="success" onClick={createHandler}>
                  إضافة صنف
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
          </Row>
          &nbsp;
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>صورة</th>
                <th>الأسم</th>
                <th>الوصف</th>
                <th>السعر</th>
                <th>الحالة</th>
                <th>الصنف</th>
                <th>خيارات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td> <Image src={product.image} width="75" height="100" /> </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.isActive ? 'YES' : ' NO'}</td>
                  <td>{product.category}</td>
                  <td>
                    <Button
                      type="button"
                      variant="warning"
                      onClick={() => navigate(`/product/${product._id}/edit`)}
                    >
                      تعديل
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => deleteHandler(product)}
                    >
                      حدف
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={``}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
