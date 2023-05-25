import type { AxiosInstance } from 'axios';

export const postServiceFinishUpgrade = async (httpClient: AxiosInstance, serviceId: string): Promise<void> => {
  await httpClient.post(`/service/${serviceId}?action=finishupgrade`);
};
