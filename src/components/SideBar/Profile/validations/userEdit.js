import * as Yup from 'yup';
export default Yup.object().shape({
  phone: Yup.number().required('required'),
  phoneCode: Yup.string().required('required'),
  country: Yup.string().required('required'),
  city: Yup.string().required('required'),
  address1: Yup.string().required('required'),
  address2: Yup.string().default('')
});
