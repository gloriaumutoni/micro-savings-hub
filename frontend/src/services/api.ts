import axios from "axios";
import type {
  Group,
  Member,
  CreateGroupPayload,
  UpdateGroupPayload,
  ContributePayload,
  Contribution,
} from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT from localStorage to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear the token and redirect to login
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const login = async (email: string, password: string): Promise<string> => {
  const res = await client.post("/auth/login", { email, password });
  return res.data.data.token;
};

export const register = async (email: string, password: string): Promise<void> => {
  await client.post("/auth/register", { email, password });
};

// ── Groups ────────────────────────────────────────────────────────────────────

export const fetchGroups = async (): Promise<Group[]> => {
  const res = await client.get("/groups");
  return res.data.data;
};

export const fetchGroup = async (id: string): Promise<Group> => {
  const res = await client.get(`/groups/${id}`);
  return res.data.data;
};

export const createGroup = async (payload: CreateGroupPayload): Promise<Group> => {
  const res = await client.post("/groups", payload);
  return res.data.data;
};

export const updateGroup = async (id: string, payload: UpdateGroupPayload): Promise<Group> => {
  const res = await client.patch(`/groups/${id}`, payload);
  return res.data.data;
};

export const closeGroup = async (id: string): Promise<void> => {
  await client.post(`/groups/${id}/close`);
};

export const addContribution = async (
  groupId: string,
  payload: ContributePayload
): Promise<Contribution> => {
  const res = await client.post(`/groups/${groupId}/contribute`, payload);
  return res.data.data;
};

// ── Invites ───────────────────────────────────────────────────────────────────

export const generateInvite = async (
  groupId: string
): Promise<{ token: string; expiresAt: string }> => {
  const res = await client.post(`/groups/${groupId}/invite`);
  return res.data.data;
};

export const joinViaInvite = async (token: string): Promise<{ groupId: string }> => {
  const res = await client.post(`/groups/join/${token}`);
  return res.data.data;
};

// ── Membership ────────────────────────────────────────────────────────────────

export const leaveGroup = async (groupId: string): Promise<void> => {
  await client.delete(`/groups/${groupId}/members/me`);
};

export const removeMember = async (groupId: string, userId: string): Promise<void> => {
  await client.delete(`/groups/${groupId}/members/${userId}`);
};

export type { Member };
