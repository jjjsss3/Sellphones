import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './OderLookup.module.scss';
import icons from '~/assets/icons';
import Button from '~/components/Button';
import * as orderService from '~/services/orderService';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { lookUp } from '~/redux/orderSlice';
import { formatCurrency } from '~/utils/format';

const cx = classNames.bind(styles);
function OrderLookup() {
   const [id, setId] = useState();
   const [phone, setPhone] = useState();

   const dispatch = useDispatch();
   const order = useSelector((state) => state.order);
   const generalInfo = useSelector((state) => state.generalInfo);

   const handleClick = async () => {
      const result = await orderService.lookup(id);
      dispatch(lookUp({ lookUp: result.data }));
   };
   return (
      <div className={cx('wrapper')}>
         <div className={cx('container')}>
            <div className={cx('bg')}></div>
            <div className={cx('icon')}>
               <img src={icons.shipper} alt="shipper" />
            </div>

            <div className={cx('content')}>
               <div className={cx('title')}>
                  <p>TRA CỨU THÔNG TIN ĐƠN HÀNG</p>
               </div>
               <div className={cx('info')}>
                  <input
                     className={cx('orderId')}
                     value={id}
                     onChange={(e) => setId(e.target.value)}
                     type="text"
                     placeholder="Nhập mã đơn hàng"
                  />
               </div>
               <div>
                  <Button normalRounded leftIcon={faMagnifyingGlass} className={cx('check')} onClick={handleClick}>
                     Kiểm tra
                  </Button>
               </div>
            </div>
            <div className={cx('result')}>
               <div className={cx('name')}>
                  <p>Họ và tên người nhận: </p>
                  {'   '}
                  <p className={cx('info')}>
                     {order?.lookUp?.address?.receive_name}
                     {', '}
                     {order?.lookUp?.address?.receive_phone}
                  </p>
               </div>
               <div className={cx('phone')}>
                  <p>Đơn hàng: </p>
                  {'   '}
                  <p className={cx('info')}>
                     {formatCurrency(
                        order?.lookUp?.total_product -
                           order?.lookUp?.total_discount -
                           order?.lookUp?.total_discount_coupons,
                        '₫',
                     )}
                     {', '}
                     {order?.lookUp?.payment_method}
                  </p>
               </div>
               <div className={cx('date')}>
                  <p>Ngày đặt đơn hàng: </p>
                  {'   '}
                  <p className={cx('info')}>{order?.lookUp?.ordered_date}</p>
               </div>
               <div className={cx('status')}>
                  <p>Trạng thái đơn hàng: </p>
                  {'   '}
                  <p className={cx('info')}>{order?.lookUp?.status}</p>
               </div>
               <div className={cx('address')}>
                  <p>Địa chỉ nhận hàng: </p>
                  {'   '}
                  <p className={cx('info')}>
                     {order?.lookUp?.address?.province} - {order?.lookUp?.address?.district} -{' '}
                     {order?.lookUp?.address?.ward} - {order?.lookUp?.address?.detail}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}

export default OrderLookup;
