import type { AxiosInstance } from 'axios';
import type { GetStacksResponse } from '../../types';

export const getStacks = async (httpClient: AxiosInstance, stackName: string): Promise<GetStacksResponse> => {
  const { data } = await httpClient.get<GetStacksResponse>('/stacks', {
    params: {
      name: stackName,
    },
  });
  return data;
};
