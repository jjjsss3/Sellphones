import * as httpRequest from '~/utils/httpRequest';
import axios from 'axios';

export const create = async (
   user_id,
   payment_method,
   receive_name,
   receive_phone,
   province,
   ward,
   district,
   detail,
   payment_id,
   products,
) => {
   try {
      const res = await axios.post(
         process.env.REACT_APP_BASE_URL + 'order/add',
         {
            user_id,
            payment_method,
            receive_name,
            receive_phone,
            province,
            ward,
            district,
            detail,
            payment_id,
            products,
         },
         {
            headers: {
               Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
            },
         },
      );
      return res.data;
   } catch (error) {
      console.error(error);
   }
};
export const get = async (id, user_id) => {
   try {
      const res = await axios.post(
         process.env.REACT_APP_BASE_URL + 'order/get',
         {
            id,
            user_id,
         },
         {
            headers: {
               Authorization: httpRequest.getAuthorizationHeader(),
            },
         },
      );
      return res.data;
   } catch (error) {
      console.error(error);
   }
};
export const lookup = async (id) => {
   try {
      const res = await axios.post(process.env.REACT_APP_BASE_URL + 'order/lookup', {
         id,
      });
      return res.data;
   } catch (error) {
      console.error(error);
   }
};
export const recent = async (user_id, payment_id) => {
   try {
      const res = await axios.post(
         process.env.REACT_APP_BASE_URL + 'order/recent',
         {
            user_id,
            payment_id,
         },
         {
            headers: {
               Authorization: httpRequest.getAuthorizationHeader(),
            },
         },
      );
      return res.data;
   } catch (error) {
      console.error(error);
   }
};
export const all = async (user_id) => {
   try {
      const res = await axios.post(
         process.env.REACT_APP_BASE_URL + 'order/all',
         {
            user_id,
         },
         {
            headers: {
               Authorization: httpRequest.getAuthorizationHeader(),
            },
         },
      );
      return res.data;
   } catch (error) {
      console.error(error);
   }
};

export const cancel = async (id, user_id) => {
   try {
      const res = await axios.post(
         process.env.REACT_APP_BASE_URL + 'order/cancel',
         {
            id,
            user_id,
         },
         {
            headers: {
               Authorization: httpRequest.getAuthorizationHeader(),
            },
         },
      );
      return res.data;
   } catch (error) {
      console.error(error);
   }
};
