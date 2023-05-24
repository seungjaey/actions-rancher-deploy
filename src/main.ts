import * as core from '@actions/core';
import { head, isEmpty, some, isUndefined } from '@fxts/core';
import { getHttpClient } from './http/http-client';
import { getStacks } from './http/api/getStacks';
import { getServices } from './http/api/getServices';
import { postServiceUpgrade } from './http/api/postServiceUpgrade';
import { getServiceState } from './http/api/getService';

const checkResource = (resource: unknown | unknown[]): boolean => some(Boolean, [resource, isEmpty(resource)]);

const handleUnhandledRejection = (reason: unknown): void => {
  core.setFailed(reason instanceof Error ? reason.message : 'Something went wrong');
};

process.on('unhandledRejection', handleUnhandledRejection);

async function run(): Promise<void> {
  core.debug('init');
  const RANCHER_URL = core.getInput('rancher_url', { required: true });
  const RANCHER_ACCESS = core.getInput('rancher_access', { required: true });
  const RANCHER_KEY = core.getInput('rancher_key', { required: true });
  const PROJECT_ID = core.getInput('project_id', { required: true });
  const STACK_NAME = core.getInput('stack_name', { required: true });
  const SERVICE_NAME = core.getInput('service_name', { required: true });
  const DOCKER_IMAGE = core.getInput('docker_image', { required: true });

  const httpClient = getHttpClient({
    rancherHost: RANCHER_URL,
    projectId: PROJECT_ID,
    username: RANCHER_ACCESS,
    password: RANCHER_KEY,
  });

  const stack = await getStacks(httpClient, STACK_NAME);
  if (!checkResource(stack)) {
    throw new Error(`Cannot find ${STACK_NAME}`);
  }
  const firstStack = head(stack.data);
  if (isUndefined(firstStack)) {
    throw new Error('Stack Not found');
  }
  const stackId = firstStack.id;
  core.debug(stackId);
  const services = await getServices(httpClient, {
    name: SERVICE_NAME,
    stackId,
  });
  if (!checkResource(services)) {
    throw new Error(`Cannot find ${STACK_NAME}`);
  }
  const firstService = head(services.data);
  core.debug(JSON.stringify(services));
  core.debug(JSON.stringify(firstService));
  if (isUndefined(firstService)) {
    throw new Error('Cannot find service');
  }
  const { id, launchConfig } = firstService;
  // NOTE: ImageUuid 가 동일한 경우는 자동 완료시켜야 할듯?
  // NOTE: 동일 태그를 재사용 하는경우...
  const nextLaunchConfig = {
    ...launchConfig,
    imageUuid: `docker:${DOCKER_IMAGE}`,
  };

  // NOTE: 업그레이드를 수행하기 전에, 기존 서비스의 상태가 FinishUpgrade 로 active 로 전환되지 않은 경우 (upgraded)
  // finishUpgrade 먼저 수행후에 갱신하도록 수정 필요.
  await postServiceUpgrade(httpClient, { serviceId: id, launchConfig: nextLaunchConfig });

  core.debug('Waiting for upgrade ...');
  // NOTE: 최대 대기시간, 최대 업데이트 polling 시간 필요
  const state = await getServiceState(httpClient, id);
  core.debug(state);
  core.debug('done');
}

run();
