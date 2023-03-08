import axios, { AxiosResponse } from 'axios';

import { environment } from '../../../environments';
import { AuthPayload } from './interfaces/AuthPayload';
import { AuthToken } from './interfaces/AuthToken';

export async function loginAsync(
  payload: AuthPayload
): Promise<AxiosResponse<AuthToken, any>> {
  const res = await axios.get<null, AxiosResponse<AuthToken>>(
    `${environment.baseUrl}/authentication/token/new?api_key=${environment.apiKey}`
  );
  
  return axios.post<AuthPayload, AxiosResponse<AuthToken>>(
    `${environment.baseUrl}/authentication/token/validate_with_login?api_key=${environment.apiKey}`,
    { ...payload, request_token: res.data.request_token }
  );
}
