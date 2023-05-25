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

type WaitResult = 'SUCCESS' | 'FAILED';

const WAIT_RESULTS: Record<WaitResult, WaitResult> = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export const waitUntilServiceState = async (
  httpClient: AxiosInstance,
  { serviceId, targetState }: Options,
): Promise<WaitResult> => {
  const result = await pipe(
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
  if (isUndefined(result)) {
    return WAIT_RESULTS.FAILED;
  }
  const finalState = last(result);
  if (finalState === targetState) {
    return WAIT_RESULTS.SUCCESS;
  }
  return WAIT_RESULTS.FAILED;
};
