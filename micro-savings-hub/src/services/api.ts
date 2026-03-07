import axios from 'axios';
import type { Group, CreateGroupPayload, ContributePayload, Contribution } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchGroups = async (): Promise<Group[]> => {
  const { data } = await client.get<Group[]>('/groups');
  return data;
};

export const fetchGroup = async (id: string): Promise<Group> => {
  const { data } = await client.get<Group>(`/groups/${id}`);
  return data;
};

export const createGroup = async (payload: CreateGroupPayload): Promise<Group> => {
  const { data } = await client.post<Group>('/groups', payload);
  return data;
};

export const addContribution = async (
  groupId: string,
  payload: ContributePayload,
): Promise<Contribution> => {
  const { data } = await client.post<Contribution>(`/groups/${groupId}/contribute`, payload);
  return data;
};
