import type { AxiosInstance } from 'axios';
import { delay, map, pipe, range, dropWhile, take, some, head, isUndefined, toAsync, last } from '@fxts/core';

import { MAX_RETRY_COUNT, POLLING_INTERVAL } from '../constants';
import { getServiceState } from '../http/api/getService';
import type { RancherServiceState } from '../types';

type StateTuple = [number, string];

const pollingServiceState = async (i: number, fetchFn: () => Promise<string>): Promise<StateTuple> => {
  const state = await fetchFn();
  return [i, state];
};

interface Options {
  serviceId: string;
  targetState: RancherServiceState;
}

const checkDeploymentSuccessful = (targetState: RancherServiceState, stateTuple?: StateTuple): boolean => {
  if (isUndefined(stateTuple)) {
    return false;
  }
  const finalState = last(stateTuple);
  return finalState === targetState;
};

export const waitUntilServiceState = async (
  httpClient: AxiosInstance,
  { serviceId, targetState }: Options,
): Promise<void> => {
  const finalState = await pipe(
    range(Infinity),
    toAsync,
    map(async (i) => pollingServiceState(i, async () => getServiceState(httpClient, serviceId))),
    map(async (tuple) => delay(POLLING_INTERVAL, tuple)),
    dropWhile((tuple) => {
      const [i, state] = tuple;
      const isMaxRetryReached = i >= MAX_RETRY_COUNT;
      const isMatchedWithTargetState = state === targetState;
      return !some(Boolean, [isMatchedWithTargetState, isMaxRetryReached]);
    }),
    take(1),
    head,
  );
  if (!checkDeploymentSuccessful(targetState, finalState)) {
    throw new Error(`Service update failed`);
  }
};
