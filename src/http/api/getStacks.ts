import type { AxiosInstance } from 'axios';

export interface GetStacksResponse {
  type: string;
  resourceType: string;
  links: {
    self: string;
  };
  createTypes: {
    composeProject: string;
    kubernetesStack: string;
    stack: string;
  };
  actions: {};
  data: {
    id: string;
    type: string;
    links: {
      self: string;
      account: string;
      hosts: string;
      instances: string;
      scheduledUpgrades: string;
      secrets: string;
      services: string;
      volumeTemplates: string;
      volumes: string;
      composeConfig: string;
    };
    actions: {
      deactivateservices: string;
      activateservices: string;
      upgrade: string;
      addoutputs: string;
      update: string;
      exportconfig: string;
      remove: string;
    };
    baseType: string;
    name: string;
    state: string;
    accountId: string;
    answers: any;
    binding: any;
    created: string;
    createdTS: number;
    description: string;
    dockerCompose: string;
    environment: any;
    externalId: any;
    group: any;
    healthState: string;
    kind: string;
    outputs: any;
    previousEnvironment: any;
    previousExternalId: any;
    rancherCompose: string;
    removed: any;
    serviceIds: string[];
    startOnCreate: boolean;
    system: boolean;
    templates: any;
    transitioning: string;
    transitioningMessage: any;
    transitioningProgress: any;
    uuid: string;
  }[];
  sortLinks: {
    accountId: string;
    created: string;
    description: string;
    externalId: string;
    group: string;
    healthState: string;
    id: string;
    kind: string;
    name: string;
    removeTime: string;
    removed: string;
    state: string;
    system: string;
    uuid: string;
  };
  pagination: {
    first: any;
    previous: any;
    next: any;
    limit: number;
    total: any;
    partial: boolean;
  };
  sort: any;
  filters: {
    accountId: any;
    created: any;
    description: any;
    externalId: any;
    group: any;
    healthState: any;
    id: any;
    kind: any;
    name: {
      value: string;
      modifier: string;
    }[];
    removeTime: any;
    removed: any;
    state: any;
    system: any;
    uuid: any;
  };
  createDefaults: {};
}

export const getStacks = async (httpClient: AxiosInstance, stackName: string): Promise<GetStacksResponse> => {
  const { data } = await httpClient.get<GetStacksResponse>('/stacks', {
    params: {
      name: stackName,
    },
  });
  return data;
};
