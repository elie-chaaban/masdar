import * as Yup from 'yup';
export default Yup.object().shape({
  password: Yup.string().required('required'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('required')
});
