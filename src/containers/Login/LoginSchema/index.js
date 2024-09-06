import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  userName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  password: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required')
});

export default loginSchema;
