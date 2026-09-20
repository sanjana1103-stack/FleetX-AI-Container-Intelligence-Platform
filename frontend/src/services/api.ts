import type { ContainerDetail, PortDetail, AnalyticsData, RouteOption, ChatMessage } from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

export async function fetchContainers(params?: { search?: string; status?: string; risk?: string; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);
  if (params?.risk) query.append('risk', params.risk);
  if (params?.limit) query.append('limit', params.limit.toString());

  const res = await fetch(`${API_BASE}/containers?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch containers');
  return res.json();
}

export async function fetchContainerById(id: string): Promise<ContainerDetail> {
  const res = await fetch(`${API_BASE}/container/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch container ${id}`);
  return res.json();
}

export async function fetchPorts(): Promise<{ total: number; ports: PortDetail[] }> {
  const res = await fetch(`${API_BASE}/ports`);
  if (!res.ok) throw new Error('Failed to fetch ports');
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function simulateDisruption(containerId: string, eventType: string) {
  const res = await fetch(`${API_BASE}/simulate-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ container_id: containerId, event_type: eventType })
  });
  if (!res.ok) throw new Error('Simulation failed');
  return res.json();
}

export async function predictETA(payload: any) {
  const res = await fetch(`${API_BASE}/predict-eta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('ETA prediction failed');
  return res.json();
}

export async function generateAiSummary(containerId: string) {
  const res = await fetch(`${API_BASE}/generate-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ container_id: containerId })
  });
  if (!res.ok) throw new Error('Failed to generate summary');
  return res.json();
}

export async function generateIncidentReport(containerId: string) {
  const res = await fetch(`${API_BASE}/generate-incident-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ container_id: containerId })
  });
  if (!res.ok) throw new Error('Failed to generate incident report');
  return res.json();
}

export async function sendChatMessage(query: string, containerId?: string) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, container_id: containerId })
  });
  if (!res.ok) throw new Error('AI Chat response failed');
  return res.json();
}

export async function fetchRouteOptions(containerId: string): Promise<Record<string, RouteOption>> {
  const res = await fetch(`${API_BASE}/route-options/${containerId}`);
  if (!res.ok) throw new Error('Failed to fetch route options');
  return res.json();
}

export async function fetchWarehouseData() {
  const res = await fetch(`${API_BASE}/warehouse`);
  if (!res.ok) throw new Error('Failed to fetch warehouse data');
  return res.json();
}
