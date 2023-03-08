import './Auth.css';

import { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { Button, Input } from '../../shared/components';
import { FormFieldStatus } from '../../shared/interfaces';
import { useAppDispatch, useAppSelector } from '../../shared/store/hooks';
import { login, selectError, selectIsLoggedIn, selectStatus } from './authSlice';
import { AuthPayload } from './interfaces/AuthPayload';

export const PASSWORD_MIN_LENGTH = 6;

interface LoginFormValidProps {
  email: FormFieldStatus;
  password: FormFieldStatus;
}

function AuthLoginScreen() {
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const loginStatus = useAppSelector(selectStatus);
  const loginError = useAppSelector(selectError);

  const [isFormValid, setIsFormValid] = useState(false);

  const [formFieldValid, setFormFieldValid] = useState<LoginFormValidProps>({
    email: { valid: false, touched: false },
    password: { valid: false, touched: false },
  });

  const [loginData, setLoginData] = useState<AuthPayload>({
    email: '',
    password: '',
    username: 'planatest',
  });

  const validateEmailField = useCallback(
    (email: string): FormFieldStatus => {
      const regex = /\S+@\S+\.\S+/;
      const valid = regex.test(email);
      return { valid, touched: formFieldValid.email.touched };
    },
    [formFieldValid.email.touched]
  );

  const validatePasswordField = useCallback(
    (password: string): FormFieldStatus => {
      return {
        valid: password.length >= PASSWORD_MIN_LENGTH,
        touched: formFieldValid.password.touched,
      };
    },
    [formFieldValid.password.touched]
  );

  useEffect(() => {
    const emailStatus = validateEmailField(loginData.email);
    const passwordStatus = validatePasswordField(loginData.password);
    const isFormValid = emailStatus.valid && passwordStatus.valid;
    setFormFieldValid({
      email: emailStatus,
      password: passwordStatus,
    });

    setIsFormValid(isFormValid);
  }, [loginData.email, loginData.password, validateEmailField, validatePasswordField]);

  const handleInputChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setLoginData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleOnInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setFormFieldValid((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof LoginFormValidProps], touched: true },
    }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    dispatch(login(loginData));
  };

  const renderEmailError = () => {
    return !formFieldValid.email.valid && formFieldValid.email.touched ? (
      <span className='Auth-input-error'>
        {!loginData.email.length ? 'Required field' : 'Invalid e-mail'}
      </span>
    ) : null;
  };

  const renderPasswordError = () => {
    return !formFieldValid.password.valid && formFieldValid.password.touched ? (
      <span className='Auth-input-error'>
        {!loginData.password.length
          ? 'Required field'
          : 'Password length must be equal or greater than 6'}
      </span>
    ) : null;
  };

  const renderLoginError = () => {
    return loginError ? <span className='Auth-input-error'>Invalid E-mail / Password</span> : null;
  };

  if (isLoggedIn) {
    return <Redirect to='/' />;
  }

  return (
    <div id='login'>
      <form noValidate onSubmit={(e) => onSubmit(e)} autoComplete='off'>
        <div className='Auth-container'>
          <div className='Auth-login-box'>
            <div>
              <h2>Login</h2>
            </div>
            {renderLoginError()}
            <div>
              <label className='Auth-input-label'>
                E-mail
                <Input
                  autoComplete='off'
                  placeholder='E-mail'
                  type='email'
                  name='email'
                  value={loginData.email}
                  onBlur={handleOnInputBlur}
                  onChange={handleInputChange}
                />
                {renderEmailError()}
              </label>
            </div>
            <div>
              <label className='Auth-input-label'>
                Password
                <Input
                  autoComplete='off'
                  name='password'
                  placeholder='Password'
                  type='password'
                  value={loginData.password}
                  onBlur={handleOnInputBlur}
                  onChange={handleInputChange}
                />
                {renderPasswordError()}
              </label>
            </div>
            <Button type='submit' disabled={!isFormValid}>
              {loginStatus === 'loading' ? 'Loading' : 'Login'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AuthLoginScreen;
