import * as core from '@actions/core';
import { head, isEmpty, some, isUndefined } from '@fxts/core';
import { getHttpClient } from './http/http-client';
import { getStacks } from './http/api/getStacks';
import { getServices } from './http/api/getServices';
import { postServiceUpgrade } from './http/api/postServiceUpgrade';
import { postServiceFinishUpgrade } from './http/api/postServiceFinishUpgrade';
import { getServiceState } from './http/api/getService';
import { waitUntilServiceState } from './utils/waitUntilServiceState';

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
  if (isUndefined(firstService)) {
    throw new Error('Cannot find service');
  }
  const { id: serviceId, launchConfig } = firstService;
  const nextLaunchConfig = {
    ...launchConfig,
    imageUuid: `docker:${DOCKER_IMAGE}`,
  };

  const currentState = await getServiceState(httpClient, serviceId);

  if (currentState === 'upgraded') {
    await postServiceFinishUpgrade(httpClient, serviceId);
  }

  await waitUntilServiceState(httpClient, { serviceId, targetState: 'active' });
  await postServiceUpgrade(httpClient, { serviceId, launchConfig: nextLaunchConfig });
  await waitUntilServiceState(httpClient, { serviceId, targetState: 'upgraded' });
  await postServiceFinishUpgrade(httpClient, serviceId);
  await waitUntilServiceState(httpClient, { serviceId, targetState: 'active' });

  core.setOutput('result', 'ok');
}

run();
