import Axios from 'axios';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deliverOrder, detailsOrder, payOrder, payOrderCash } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants';
import ListGroup from "react-bootstrap/ListGroup";
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { getError } from '../utils';
import axios from 'axios';




export default function OrderScreen(props) {
  const params = useParams();
  const { id: orderId } = params;

  const [sdkReady, setSdkReady] = useState(false);
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;
  const dispatch = useDispatch();
  useEffect(() => {
    const addPayPalScript = async () => {
      const { data } = await Axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (
      !order ||
      successPay ||
      successDeliver ||
      (order && order._id !== orderId)
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(detailsOrder(orderId));
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [dispatch, orderId, sdkReady, successPay, successDeliver, order]);




  async function deliverOrderHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("Order is delivered");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "DELIVER_FAIL" });
    }
  }

  async function PayOrderHandler() {
    try {
      dispatch({ type: "PAY_REQUEST" });
      const { data } = await axios.put(
        `/api/orders/${order._id}/payOrderCash`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("Order is Paid");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "DELIVER_FAIL" });
    }
  }
  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrderCash(order, paymentResult));
  };
  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <div>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>العناصر</Card.Title>
                <ListGroup variant="flush">
                  {order.orderItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          ></img>{" "}
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={3}>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col md={3}>
                          {item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>بيانات التوصيل</Card.Title>
                <Card.Text>
                  <strong >  Name : </strong> {order.shippingAddress.fullName}{" "}
                  <br />
                  <strong> Phone  : </strong>{order.shippingAddress.phone}{" "}{" "}
                  <br />
                  <strong> Address : </strong>{" "}
                  {order.shippingAddress.address}
                </Card.Text>

              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>حالة الطلب</Card.Title>
                <Card.Text>
                </Card.Text>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    تم الإستلام  {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">لم يتم الإستلام  </MessageBox>
                )}
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    تم التسليم {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger"> لم يتم التسليم  </MessageBox>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title> ملخص الطلب </Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>العناصر</Col>
                      <Col>
                        {order.itemsPrice.toFixed(2)}

                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>التوصيل</Col>
                      <Col>
                        {order.shippingPrice.toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>  إجمالي الفاتورة </strong>
                      </Col>
                      <Col>
                        <strong>
                          {order.totalPrice.toFixed(2)}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {(userInfo.isAdmin || userInfo.isSeller) && !order.isPaid && (
                    <ListGroup.Item>
                      {loadingDeliver && <LoadingBox></LoadingBox>}
                      <div className="d-grid">
                        <Button type="button" onClick={PayOrderHandler}>
                          تم الإستلام
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                  {(userInfo.isAdmin || userInfo.isSeller) && !order.isDelivered && (
                    <ListGroup.Item>
                      {loadingDeliver && <LoadingBox></LoadingBox>}
                      <div className="d-grid">
                        <Button type="button" onClick={deliverOrderHandler}>
                          تم التسليم
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
