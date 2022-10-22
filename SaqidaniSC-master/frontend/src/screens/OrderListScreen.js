import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { deleteOrder, listOrders } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';


export default function OrderListScreen(props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sellerMode = pathname.indexOf('/seller') >= 0;
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  const orderDelete = useSelector((state) => state.orderDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = orderDelete;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ORDER_DELETE_RESET });
    dispatch(listOrders({ seller: sellerMode ? userInfo._id : '' }));
  }, [dispatch, sellerMode, successDelete, userInfo._id]);
  const deleteHandler = (order) => {
    if (window.confirm('Are you sure to delete?')) {
      dispatch(deleteOrder(order._id));
    }
  };
  return (
    <div>
      <h1>الطلبات</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>الأسم</th>
              <th>العنوان</th>
              <th>الهاتف</th>
              <th>المجموع الفاتورة</th>
              <th>التاريخ</th>
              <th>تم الإستلام</th>
              <th>تم التسليم</th>
              <th>خيارات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.shippingAddress.fullName}</td>
                <td>{order.shippingAddress.address}</td>
                <td>{order.shippingAddress.phone}</td>
                <td>  {order.totalPrice.toFixed(2)} دينار   </td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                <Button
                    type="button"
                    variant="primary" size="sm"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    التفاصيل
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant='danger' size="sm"
                    onClick={() => deleteHandler(order)}
                  >
                    حدف
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          </Table>
      )}
    </div>
  );
}
