export const formatCurrency = (n, currency) => {
   return (
      n.toFixed(0).replace(/./g, function (c, i, a) {
         return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
      }) + currency
   );
};
export const phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
export const emailRe =
   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const formatDate = (date) => {
   let myDate = new Date(date);
   var month = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
   ][myDate.getMonth()];
   return (
      myDate.getDate() +
      ' ' +
      month +
      ' Năm ' +
      myDate.getFullYear() +
      ', ' +
      myDate.getHours() +
      ' giờ ' +
      myDate.getMinutes() +
      ' phút'
   );
};
export const getDate = () => {
   let myDate = new Date();
   return (
      myDate.getDate() +
      '' +
      myDate.getMonth() +
      '' +
      myDate.getFullYear() +
      '' +
      myDate.getHours() +
      '' +
      myDate.getMinutes() +
      '' +
      myDate.getSeconds()
   );
};
export const formatStatus = (s) => {
   if (s === 'Canceled') return 'Đã huỷ';
   if (s === 'Waiting for Confirm') return 'Chờ xác nhận';
   if (s === 'Confirmed') return 'Đã xác nhận';
   if (s === 'Delivering') return 'Đang giao hàng';
   if (s === 'Completed') return 'Giao hàng thành công';
};
export const formatPaid = (s) => {
   if (s === 'Cash in Delivery') return 'Thanh toán khi nhận hàng';
   if (s === 'Paid in Paypal') return 'Thanh toán bằng Paypal';
};
