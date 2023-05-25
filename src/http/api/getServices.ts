import type { AxiosInstance } from 'axios';
import type { GetServicesResponse } from '../../types';

interface Options {
  stackId: string;
  name: string;
}

export const getServices = async (
  httpClient: AxiosInstance,
  { stackId, name }: Options,
): Promise<GetServicesResponse> => {
  const { data } = await httpClient.get<GetServicesResponse>('/services', {
    params: {
      name,
      stackId,
    },
  });
  return data;
};
