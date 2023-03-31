import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import * as cartService from '~/services/cartService';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './BoxProductItem.module.scss';
import Image from '~/components/Image';
import icons from '~/assets/icons';
import { formatCurrency } from '~/utils/format';
import { setAmountCart, addToCart } from '~/redux/generalInfoSlice';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);
function BoxProductItem({ product }) {
   const navigate = useNavigate();

   const dispatch = useDispatch();
   const generalInfo = useSelector((state) => state.generalInfo);

   const handleClick = async () => {
      toast.remove();
      if (generalInfo.user === null) {
         toast.loading('Vui lòng đăng nhập');
         setTimeout(() => navigate(`/sign`), 1000);
      } else {
         const res = await cartService.add(generalInfo.user.id, product.id);
         dispatch(setAmountCart({ amount: Number(generalInfo.amountCart) + 1 }));
         if (generalInfo.listCart !== null) {
            dispatch(addToCart({ product: product }));
         }
         toast.success('Thêm thành công');
      }
   };
   return (
      <div className={cx('wrapper')}>
         <div
            style={{ visibility: product.discount !== null ? 'visible' : 'hidden' }}
            className={cx('discountPercent')}
         >
            <Image src={icons.tagDiscount} className={cx('icon')} />
            <div className={cx('detail')}>
               Giảm
               <p className={cx('percent')}>
                  {formatCurrency(product.discount !== null ? product.discount.discount_value : 0, '%')}
               </p>
            </div>
         </div>
         <Link to={`/product/${product.id}`} className={cx('content')}>
            <Image src={process.env.PUBLIC_URL + product.images[0]} alt={product.name} className={cx('img')} />
            <p className={cx('name')}>{product.name}</p>
            <div className={cx('price')}>
               {product.discount !== null && (
                  <p className={cx('originalPrice')}>{formatCurrency(product.sell_price, '₫')}</p>
               )}
               {product.discount !== null ? (
                  <p className={cx('discountPrice')}>
                     {formatCurrency((product.sell_price / 100) * (100 - product.discount.discount_value), '₫')}
                  </p>
               ) : (
                  <p style={{ textAlignLast: 'center' }} className={cx('discountPrice')}>
                     {formatCurrency(product.sell_price, '₫')}
                  </p>
               )}
            </div>
            <div className={cx('info')}>
               <p>Tặng kèm cáp sạc</p>
            </div>
         </Link>
         <div className={cx('function')}>
            <div className={cx('wishlist')}>
               Yêu thích
               <FontAwesomeIcon icon={faHeartRegular} className={cx('icon')} />
            </div>

            <div className={cx('cart')} onClick={handleClick}>
               <p>THÊM VÀO GIỎ</p>
            </div>
         </div>
      </div>
   );
}
BoxProductItem.propTypes = {
   id: PropTypes.string,
   image: PropTypes.string,
   name: PropTypes.string,
   price: PropTypes.number,
   discount: PropTypes.number,
};
export default BoxProductItem;
