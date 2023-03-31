import * as ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';

import styles from './Account.module.scss';
import CartItem from '~/components/CartItem';
import { formatCurrency, formatDate, formatStatus, formatPaid } from '~/utils/format';
import * as orderService from '~/services/orderService';
import { setAll } from '~/redux/orderSlice';
import Image from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   faBox,
   faBoxOpen,
   faCube,
   faCubes,
   faGift,
   faHouse,
   faMailBulk,
   faMobileAlt,
   faMobileRetro,
   faMobileScreen,
   faMoneyBill,
   faPhone,
   faRankingStar,
   faSackDollar,
} from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);
function Account() {
   const generalInfo = useSelector((state) => state.generalInfo);
   const order = useSelector((state) => state.order);
   const dispatch = useDispatch();
   useEffect(() => {
      const fetchList = async () => {
         const res = await orderService.all(generalInfo.user.id);
         dispatch(setAll({ list: res.data }));
      };
      fetchList();
   }, []);
   if (generalInfo.user === null) return <Navigate to="/sign" />;
   else
      return (
         <div className={cx('wrapper')}>
            <div className={cx('container')}>
               <div className={cx('block-top')}>
                  <div className={cx('avatar')}>
                     <Image src={'aaa'} />
                  </div>
                  <div className={cx('info')}>
                     <div className={cx('name')}>{generalInfo.user.full_name}</div>
                     <div className={cx('contact')}>
                        <div>
                           <FontAwesomeIcon icon={faPhone} /> {generalInfo.user.phone}
                        </div>
                        <div className={cx('right')}>
                           <FontAwesomeIcon icon={faMailBulk} /> {generalInfo.user.email}
                        </div>
                     </div>
                     <div className={cx('address')}>
                        <FontAwesomeIcon icon={faHouse} /> {generalInfo.user.address}
                     </div>
                     <div className={cx('point')}>
                        <div>
                           <FontAwesomeIcon icon={faGift} /> {generalInfo.user.point}
                        </div>
                        <div className={cx('right')}>
                           <FontAwesomeIcon icon={faRankingStar} /> {generalInfo.user.rank_id}
                        </div>
                     </div>
                     <div className={cx('point')}>
                        <div>
                           <FontAwesomeIcon icon={faSackDollar} />{' '}
                           {formatCurrency(order.listAll ? order.listAll.total : 0, '₫')}
                        </div>
                        <div className={cx('right')}>
                           <FontAwesomeIcon icon={faMobileScreen} /> {order.listAll ? order.listAll.amount : 0}
                        </div>
                        <div className={cx('right')}>
                           <FontAwesomeIcon icon={faBoxOpen} /> {order.listAll ? order.listAll.count : 0}
                        </div>
                     </div>
                  </div>
               </div>
               <div className={cx('block-bottom')}>
                  <div className={cx('orders')}>
                     <div className={cx('title')}>LỊCH SỬ ĐƠN HÀNG</div>
                     <table>
                        <thead>
                           <th>#</th>
                           <th>Mã đơn</th>
                           <th>Thời gian</th>
                           <th>Thanh toán</th>
                           <th>Tổng tiền</th>
                           <th>Trạng thái</th>
                        </thead>
                        <tbody>
                           {order.listAll !== null ? (
                              order.listAll.orders.length === 0 ? (
                                 <tr>
                                    <td colSpan={6}>KHÔNG CÓ ĐƠN HÀNG NÀO</td>{' '}
                                 </tr>
                              ) : (
                                 order.listAll.orders.map((order, index) => (
                                    <tr key={index}>
                                       <td>{index + 1}</td>
                                       <td>
                                          <Link to={`/order/${order.id}`}>#{order.id}</Link>
                                       </td>
                                       <td>
                                          <Link to={`/order/${order.id}`}>{formatDate(order.ordered_date)}</Link>
                                       </td>
                                       <td>
                                          <Link to={`/order/${order.id}`}> {formatPaid(order.payment_method)}</Link>
                                       </td>
                                       <td>
                                          <Link to={`/order/${order.id}`}>
                                             {formatCurrency(
                                                order.total_product -
                                                   order.total_discount -
                                                   order.total_discount_coupons,
                                                '₫',
                                             )}
                                          </Link>
                                       </td>
                                       <td>
                                          <Link to={`/order/${order.id}`}>{formatStatus(order.status)}</Link>
                                       </td>
                                    </tr>
                                 ))
                              )
                           ) : null}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      );
}

export default Account;
