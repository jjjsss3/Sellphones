import classNames from 'classnames/bind';
import Input from '~/components/Input';
import Button from '~/components/Button';
import * as ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import * as orderService from '~/services/orderService';
import { useSelector, useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { phoneRe, emailRe } from '~/utils/format';
import { getDate } from '~/utils/format';
import styles from './Pay.module.scss';
import { setAll } from '~/redux/orderSlice';
import { useState, useCallback, useEffect, sendData, memo } from 'react';
import Payment from '~/components/Payment/Payment';
const cx = classNames.bind(styles);
function Pay({}) {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   let payment_cod_id;
   const generalInfo = useSelector((state) => state.generalInfo);
   const order = useSelector((state) => state.order);
   const handleCod = () => {
      checkOrder() &&
         confirmAlert({
            title: 'Xác nhận đặt hàng',
            message: 'Xác nhận việc đặt hàng của bạn',
            buttons: [
               {
                  label: 'Đặt hàng',
                  onClick: () => addOrder(),
               },
               {
                  label: 'Trở lại',
                  // onClick: () => alert('Click No'),
               },
            ],
         });
   };

   const addOrder = async () => {
      payment_cod_id = 'COD' + getDate();
      toast.remove();

      toast.loading('Tiến hành đặt hàng');
      const res = await orderService.create(
         generalInfo.user.id,
         'Cash in Delivery',
         order.nameReceive,
         order.phoneReceive,
         order.addressReceive.province.name,
         order.addressReceive.district.name,
         order.addressReceive.ward.name,
         order.addressReceive.detail,
         payment_cod_id,
         order.listOrder,
      );
      const id = await orderService.recent(generalInfo.user.id, payment_cod_id);
      const list = await orderService.all(generalInfo.user.id);
      dispatch(setAll({ list: list.data }));
      setTimeout(() => navigate(`/order/${id.data}`), 1000);
   };
   const checkOrder = () => {
      toast.remove();
      if (order.listOrder.length === 0) {
         toast.error('Không có sản phẩm');
         return false;
      }
      if (order.nameReceive === '' || !phoneRe.test(order.phoneReceive) || !emailRe.test(order.emailReceive)) {
         toast.error('Vui lòng nhập đủ thông tin nhận hàng');
         return false;
      }
      if (
         order.addressReceive.province.name === null ||
         order.addressReceive.district.name === null ||
         order.addressReceive.ward.name === null ||
         order.addressReceive.detail === ''
      ) {
         toast.error('Vui lòng chọn địa chỉ giao hàng');
         return false;
      }
      return true;
   };
   return (
      <div className={cx('wrapper')}>
         <button className={cx('cod')} onClick={handleCod}>
            THANH TOÁN LÚC NHẬN HÀNG
         </button>
         <p>Hoặc</p>
         <Payment />
      </div>
   );
}

export default Pay;
