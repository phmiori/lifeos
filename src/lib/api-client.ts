const BASE = '/api'

async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  const json = await res.json()
  if (!json.success) {
    throw new Error(json.error?.message || 'Erro na requisição')
  }
  return json.data as T
}

// ── Music ───────────────────────────────────────────────────
export const musicApi = {
  getSongs: (params = '') => apiFetch(`/music/songs?${params}`),
  streamUrl: (id: string) => `${BASE}/music/songs/${id}/stream`,
  getPlaylists: () => apiFetch('/music/playlists'),
  createPlaylist: (data: object) =>
    apiFetch('/music/playlists', { method: 'POST', body: JSON.stringify(data) }),
  getPlaylist: (id: string) => apiFetch(`/music/playlists/${id}`),
}

// ── Movies ──────────────────────────────────────────────────
export const moviesApi = {
  getMovies: (params = '') => apiFetch(`/movies?${params}`),
  getMovie: (id: string) => apiFetch(`/movies/${id}`),
  streamUrl: (id: string) => `${BASE}/movies/${id}/stream`,
  saveProgress: (id: string, progress: number, completed: boolean) =>
    apiFetch(`/movies/${id}/progress`, {
      method: 'POST',
      body: JSON.stringify({ progress_secs: progress, completed }),
    }),
}

// ── Garage ──────────────────────────────────────────────────
export const garageApi = {
  getCars: () => apiFetch('/garage/cars'),
  getCar: (id: string) => apiFetch(`/garage/cars/${id}`),
  createCar: (data: object) =>
    apiFetch('/garage/cars', { method: 'POST', body: JSON.stringify(data) }),
  updateCar: (id: string, data: object) =>
    apiFetch(`/garage/cars/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCar: (id: string) =>
    apiFetch(`/garage/cars/${id}`, { method: 'DELETE' }),
  getSummary: (id: string) => apiFetch(`/garage/cars/${id}/summary`),
  getMaintenances: (id: string) => apiFetch(`/garage/cars/${id}/maintenances`),
  addMaintenance: (carId: string, data: object) =>
    apiFetch(`/garage/cars/${carId}/maintenances`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
