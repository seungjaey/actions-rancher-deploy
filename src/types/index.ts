export interface RancherStack {
  id: string;
}

export interface GetStacksResponse {
  data: RancherStack[];
}

export interface RancherLaunchConfig {
  imageUuid: string;
}

export interface RancherService {
  id: string;
  launchConfig: RancherLaunchConfig;
  uuid: string;
}

export interface GetServicesResponse {
  data: RancherService[];
}

export type RancherServiceState = 'upgraded' | 'active';

export interface GetServiceResponse {
  state: RancherServiceState;
}
