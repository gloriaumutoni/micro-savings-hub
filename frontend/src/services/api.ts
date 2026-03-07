import axios from "axios";
import type {
  Group,
  CreateGroupPayload,
  ContributePayload,
  Contribution,
} from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const fetchGroups = async (): Promise<Group[]> => {
  const res = await client.get("/groups");
  return res.data.data;
};

export const fetchGroup = async (id: string): Promise<Group> => {
  const res = await client.get(`/groups/${id}`);
  return res.data.data;
};

export const createGroup = async (
  payload: CreateGroupPayload,
): Promise<Group> => {
  const res = await client.post("/groups", payload);
  return res.data.data;
};

export const addContribution = async (
  groupId: string,
  payload: ContributePayload,
): Promise<Contribution> => {
  const res = await client.post(`/groups/${groupId}/contribute`, payload);
  return res.data.data;
};
