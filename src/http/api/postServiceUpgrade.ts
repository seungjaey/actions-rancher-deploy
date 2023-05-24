import type { AxiosInstance } from 'axios';

interface Options {
  serviceId: string;
  launchConfig: {
    type: string;
    blkioWeight: any;
    capAdd: any[];
    capDrop: any[];
    cgroupParent: any;
    count: any;
    cpuCount: any;
    cpuPercent: any;
    cpuPeriod: any;
    cpuQuota: any;
    cpuRealtimePeriod: any;
    cpuRealtimeRuntime: any;
    cpuSet: any;
    cpuSetMems: any;
    cpuShares: any;
    dataVolumes: any[];
    dataVolumesFrom: any[];
    description: any;
    devices: any[];
    diskQuota: any;
    dns: any[];
    dnsSearch: any[];
    domainName: any;
    environment: {
      RUN_STAGE: string;
      STAGE: string;
    };
    healthInterval: any;
    healthRetries: any;
    healthTimeout: any;
    hostname: any;
    imageUuid: string;
    instanceTriggeredStop: string;
    ioMaximumBandwidth: any;
    ioMaximumIOps: any;
    ip: any;
    ip6: any;
    ipcMode: any;
    isolation: any;
    kernelMemory: any;
    kind: string;
    labels: {
      'traefik.backend': string;
      'traefik.enable': string;
      'traefik.frontend.rule': string;
      'traefik.port': string;
      'io.rancher.scheduler.affinity:host_label': string;
    };
    logConfig: {
      type: string;
      config: {};
      driver: any;
    };
    memory: any;
    memoryMb: any;
    memoryReservation: any;
    memorySwap: any;
    memorySwappiness: any;
    milliCpuReservation: any;
    networkMode: string;
    oomScoreAdj: any;
    pidMode: any;
    pidsLimit: any;
    ports: any[];
    privileged: boolean;
    publishAllPorts: boolean;
    readOnly: boolean;
    requestedIpAddress: any;
    runInit: boolean;
    secrets: any[];
    shmSize: any;
    startOnCreate: boolean;
    stdinOpen: boolean;
    stopSignal: any;
    stopTimeout: any;
    system: boolean;
    tty: boolean;
    user: any;
    userdata: any;
    usernsMode: any;
    uts: any;
    version: string;
    volumeDriver: any;
    workingDir: any;
    dataVolumesFromLaunchConfigs: any[];
    networkLaunchConfig: any;
    vcpu: number;
    drainTimeoutMs: number;
  };
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
