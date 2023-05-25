import type { AxiosInstance } from 'axios';
import type { RancherLaunchConfig } from '../../types';

interface Options {
  serviceId: string;
  launchConfig: RancherLaunchConfig;
}

// TODO: add Option.actionState or Option.state
// TODO: extract actionState as constants
export const postServiceUpgrade = async (
  httpClient: AxiosInstance,
  { serviceId, launchConfig }: Options,
): Promise<void> => {
  await httpClient.post(`/service/${serviceId}?action=upgrade`, {
    inServiceStrategy: {
      launchConfig,
    },
  });
};
