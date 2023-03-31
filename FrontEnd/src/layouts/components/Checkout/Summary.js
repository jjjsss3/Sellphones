import { memo, useState } from 'react';
import classNames from 'classnames/bind';
import Image from '~/components/Image';
import { formatCurrency } from '~/utils/format';
import { useSelector, useDispatch } from 'react-redux';

import styles from './Summary.module.scss';
import Tag from '~/components/Tag';
const cx = classNames.bind(styles);
function Summary() {
   const generalInfo = useSelector((state) => state.generalInfo);
   const order = useSelector((state) => state.order);

   // console.log('re-render summary');
   return (
      <div className={cx('wrapper')}>
         <div className={cx('title')}>CHI TIẾT ĐƠN HÀNG</div>
         <div className={cx('total')}>
            <div className={cx('price-products')}>
               Tổng tiền sản phẩm <p>{formatCurrency(order.total, '₫')}</p>
            </div>
            <div className={cx('price-delivery')}>
               Mã khuyến mãi{' '}
               <p>
                  -
                  {formatCurrency(
                     order.discount_enter_info !== null
                        ? (order.discount_enter_info.discount_value * order.total) / 100 >
                          order.discount_enter_info.max_discount_amount
                           ? order.discount_enter_info.max_discount_amount
                           : (order.discount_enter_info.discount_value * order.total) / 100
                        : 0,
                     '₫',
                  )}
               </p>
            </div>
            <div className={cx('quantity-products')}>
               Số lượng sản phẩm <p>{order.amount}</p>
            </div>
            <div className={cx('price-promo')}>
               Khuyến mãi <p>{formatCurrency(-order.discount, '₫')}</p>
            </div>
            <hr
               style={{
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary)',
                  height: 5,
               }}
            ></hr>
            <div className={cx('price-total')}>
               Tổng thanh toán
               <p>
                  {formatCurrency(
                     order.total -
                        order.discount -
                        (order.discount_enter_info !== null
                           ? (order.discount_enter_info.discount_value * order.total) / 100 >
                             order.discount_enter_info.max_discount_amount
                              ? order.discount_enter_info.max_discount_amount
                              : (order.discount_enter_info.discount_value * order.total) / 100
                           : 0),
                     '₫',
                  )}
               </p>
            </div>
         </div>
         <div className={cx('detail')}>
            {order.listOrder.map((product) => (
               <div key={product.id} className={cx('detail-wrapper')}>
                  <Image src={product.images[0]} alt={product.name} className={cx('img')} />
                  <div className={cx('detail-info')}>
                     <div className={cx('detail-name')}>
                        <p className={cx('name')}>{product.name}</p>
                        {/* <Tag name={product.brand} className={cx('tag')} /> */}
                     </div>
                     <div className={cx('price')}>
                        {product.discount !== null ? (
                           <p className={cx('discount')}>
                              {formatCurrency(
                                 ((100 - product.discount.discount_value) * product.sell_price) / 100,
                                 '₫',
                              )}
                           </p>
                        ) : (
                           <p className={cx('discount')}>{formatCurrency(product.sell_price, '₫')}</p>
                        )}
                        {product.discount !== null && (
                           <p className={cx('price-original')}>{formatCurrency(product.sell_price, '₫')}</p>
                        )}
                     </div>
                     <div className={cx('quantity')}>
                        <p>Số lượng: {product.amount_cart}</p>
                     </div>
                     {product.discount !== null ? (
                        <p className={cx('price-total')}>
                           Tổng cộng:{' '}
                           {formatCurrency(
                              (product.amount_cart * (100 - product.discount.discount_value) * product.sell_price) /
                                 100,
                              '₫',
                           )}
                        </p>
                     ) : (
                        <p className={cx('price-total')}>
                           Tổng cộng: {formatCurrency(product.amount_cart * product.sell_price, '₫')}
                        </p>
                     )}
                     {/* <p className={cx('price-total')}>{formatCurrency(product.price - product.discount, '₫')}</p> */}
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}

export default memo(Summary);
