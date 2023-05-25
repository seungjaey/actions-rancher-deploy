import type { AxiosInstance } from 'axios';
import type { GetServiceResponse, RancherServiceState } from '../../types';

export const getService = async (httpClient: AxiosInstance, serviceId: string): Promise<GetServiceResponse> => {
  const { data } = await httpClient.get<GetServiceResponse>(`/services/${serviceId}`);
  return data;
};

export const getServiceState = async (httpClient: AxiosInstance, serviceId: string): Promise<RancherServiceState> => {
  const service = await getService(httpClient, serviceId);
  return service.state;
};
