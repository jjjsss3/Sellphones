import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './OrderDetail.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateProduct, getListColor, getListProduct, getListMemory } from '~/redux/productSlice';
import { setOrder } from '~/redux/orderSlice';
import { formatCurrency, formatDate, formatStatus, formatPaid } from '~/utils/format';
import toast, { Toaster } from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { setAll } from '~/redux/orderSlice';
import * as orderService from '~/services/orderService';
import * as memoryService from '~/services/memoryService';
import * as productService from '~/services/productService';
const cx = classNames.bind(styles);
function OrderDetail() {
   const dispatch = useDispatch();
   const order = useSelector((state) => state.order);
   const generalInfo = useSelector((state) => state.generalInfo);
   const params = useParams();
   const fetchOrder = async () => {
      if (order.order !== null) {
         if (order.order.id !== params.id) {
            const res = await orderService.get(params.id, generalInfo.user.id);
            dispatch(setOrder({ order: res.data }));
         }
      } else {
         const res = await orderService.get(params.id, generalInfo.user.id);
         dispatch(setOrder({ order: res.data }));
      }
   };
   useEffect(() => {
      toast.remove();
      fetchOrder();
   }, []);
   const handleCancel = () => {
      confirmAlert({
         title: 'Xác nhận huỷ đơn',
         message: 'Bạn chắc chắn muốn huỷ đơn hiện tại',
         buttons: [
            {
               label: 'Huỷ',
               onClick: () => cancelOrder(),
            },
            {
               label: 'Trở lại',
               // onClick: () => alert('Click No'),
            },
         ],
      });
   };
   const cancelOrder = async () => {
      // toast.remove();
      toast.loading('Đang huỷ');
      const res = await orderService.cancel(order.order.id, generalInfo.user.id);
      if (res.data) {
         toast.success('Huỷ thành công');
         const newO = await orderService.get(params.id, generalInfo.user.id);
         dispatch(setOrder({ order: newO.data }));
         const newL = await orderService.all(generalInfo.user.id);
         dispatch(setAll({ list: newL.data }));
      }
   };
   return (
      <div className={cx('wrapper')}>
         {order.order !== null && (
            <div className={cx('container')}>
               <div className={cx('box-left')}>
                  <div className={cx('title')}>
                     <p>
                        Đơn hàng #{order.order.id} {formatStatus(order.order.status)}
                     </p>
                     {order.order.status === 'Waiting for confirm' &&
                        order.order.payment_method === 'Cash in Delivery' && (
                           <button onClick={handleCancel} className={cx('btn-cancel')}>
                              HUỶ ĐƠN
                           </button>
                        )}
                  </div>

                  {order.order.status !== 'Canceled' && <div className={cx('thank')}>Cảm ơn vì đã đặt hàng</div>}
                  <div className={cx('detail')}>
                     <div className={cx('title')}>Chi tiết đơn hàng</div>
                     <div className={cx('time')}>Thời gian đặt hàng: {formatDate(order.order.ordered_date)}</div>

                     <table>
                        <thead>
                           <th>#</th>
                           <th>Ảnh</th>
                           <th>Sản phẩm</th>
                           <th>Đơn giá</th>
                           <th>Giảm giá</th>
                           <th>Số lượng</th>
                           <th>Tổng</th>
                        </thead>
                        <tbody>
                           {order.order.products.map((p, index) => (
                              <tr key={index}>
                                 <td>{index + 1}</td>
                                 <td>
                                    <img src={p.images[0]} />
                                 </td>
                                 <td>{p.name}</td>
                                 <td>
                                    {formatCurrency(p.sell_price, '₫')}
                                    <p>
                                       {window.innerWidth <= 420 &&
                                          formatCurrency(
                                             p.discount ? (-p.discount.discount_value * p.sell_price) / 100 : 0,
                                             '₫',
                                          )}
                                    </p>
                                 </td>
                                 <td>
                                    {formatCurrency(
                                       p.discount ? (-p.discount.discount_value * p.sell_price) / 100 : 0,
                                       '₫',
                                    )}
                                 </td>
                                 <td>{p.ordered_amount}</td>

                                 <td>
                                    {p.discount
                                       ? formatCurrency(
                                            p.ordered_amount * p.sell_price -
                                               (p.discount.discount_value * p.sell_price) / 100,
                                            '₫',
                                         )
                                       : formatCurrency(p.ordered_amount * p.sell_price, '₫')}
                                 </td>
                              </tr>
                           ))}
                           <tr>
                              <th colSpan={window.innerWidth > 420 ? '6' : '4'}>Tổng cộng</th>
                              <td style={{ textAlign: 'right' }}>{formatCurrency(order.order.total_product, '₫')}</td>
                           </tr>
                           <tr>
                              <th colSpan={window.innerWidth > 420 ? '6' : '4'}>Khuyến mãi</th>
                              <td style={{ textAlign: 'right' }}>{formatCurrency(-order.order.total_discount, '₫')}</td>
                           </tr>
                           <tr>
                              <th colSpan={window.innerWidth > 420 ? '6' : '4'}>Mã giảm giá</th>
                              <td style={{ textAlign: 'right' }}>
                                 {formatCurrency(-order.order.total_discount_coupons, '₫')}
                              </td>
                           </tr>
                           <tr>
                              <th colSpan={window.innerWidth > 420 ? '6' : '4'}>Thanh toán</th>
                              <td style={{ textAlign: 'right', fontWeight: 700, fontStyle: 'italic' }}>
                                 {formatCurrency(
                                    order.order.total_product -
                                       order.order.total_discount -
                                       order.order.total_discount_coupons,
                                    '₫',
                                 )}
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>

               <div className={cx('box-right')}>
                  <div className={cx('payment')}>
                     <div className={cx('title')}>THANH TOÁN</div>
                     <p>Mã: {order.order.payment_id}</p>
                     <p>Hình thức: {formatPaid(order.order.payment_method)}</p>
                  </div>
                  <div className={cx('address')}>
                     <div className={cx('title')}>NHẬN HÀNG</div>
                     <p>Người nhận: {order.order.address.receive_name}</p>
                     <p>Số điện thoại: {order.order.address.receive_phone}</p>
                     <p>Tỉnh: {order.order.address.province}</p>
                     <p>Quận: {order.order.address.district}</p>
                     <p>Phường: {order.order.address.ward}</p>
                     <p>Nhà: {order.order.address.detail}</p>
                  </div>
                  <div className={cx('address')}></div>
               </div>
            </div>
         )}
      </div>
   );
}

export default OrderDetail;
