import axios, { AxiosInstance } from 'axios';

interface Options {
  rancherHost: string;
  projectId: string;
  username: string;
  password: string;
}
// 7A615298D6EA6FF7314D
// EuihPFPnkNPVs3b7EKGr9aBWojCiTt4xmMtBJQic
export const getHttpClient = ({ rancherHost, projectId, username, password }: Options): AxiosInstance => {
  return axios.create({
    baseURL: `${rancherHost}/v2-beta/projects/${projectId}`,
    auth: {
      username,
      password,
    },
  });
};
