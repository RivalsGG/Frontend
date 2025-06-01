import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const checkAuth = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('You must be logged in to perform this action');
  }
}

export interface Player {
  playerId: number;
  playerName: string;
  playerAuthId: string;
  playerIcon: string;
  playerColor: string;
}

export interface MarvelHero {
  id: string;
  name: string;
  imageUrl: string;
  role: string;
  real_Name?: string;
  difficulty?: string;
  bio?: string;
  lore?: string;
  team?: string[];
  abilities?: MarvelHeroAbility[];
}

export interface MarvelHeroAbility {
  name: string;
  description: string;
  icon: string;
  type: string;
}

const LOCAL_API_URL = 'https://localhost:7123/api';
const DOCKER_API_URL = 'http://localhost:8080/api';

export const PlayerService = {
  getAllPlayers: async (): Promise<Player[]> => {
    try {
      const response = await axios.get<Player[]>(`${LOCAL_API_URL}/Player`);
      return response.data;
    } catch (error) {
      console.log('Local API not available, trying Docker environment...');
      const response = await axios.get<Player[]>(`${DOCKER_API_URL}/Player`);
      return response.data;
    }
  },
  
  getPlayer: async (id: number): Promise<Player> => {
    try {
      const response = await axios.get<Player>(`${LOCAL_API_URL}/Player/${id}`);
      return response.data;
    } catch (error) {
      const response = await axios.get<Player>(`${DOCKER_API_URL}/Player/${id}`);
      return response.data;
    }
  },
  
  createPlayer: async (playerData: Omit<Player, 'playerId'>): Promise<Player> => {
    try {
      const response = await axios.post<Player>(`${LOCAL_API_URL}/Player`, playerData);
      return response.data;
    } catch (error) {
      const response = await axios.post<Player>(`${DOCKER_API_URL}/Player`, playerData);
      return response.data;
    }
  },
  
  updatePlayer: async (id: number, playerData: Partial<Player>): Promise<Player> => {
    try {
      const response = await axios.put<Player>(`${LOCAL_API_URL}/Player/${id}`, playerData);
      return response.data;
    } catch (error) {
      const response = await axios.put<Player>(`${DOCKER_API_URL}/Player/${id}`, playerData);
      return response.data;
    }
  },
  
  deletePlayer: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${LOCAL_API_URL}/Player/${id}`);
    } catch (error) {
      await axios.delete(`${DOCKER_API_URL}/Player/${id}`);
    }
  }
};

export const MarvelHeroService = {
  getAllHeroes: async (): Promise<MarvelHero[]> => {
    try {
      const response = await axios.get<MarvelHero[]>(`${LOCAL_API_URL}/MarvelHeroes`);
      return response.data;
    } catch (error) {
      console.log('Local API not available, trying Docker environment...');
      const response = await axios.get<MarvelHero[]>(`${DOCKER_API_URL}/MarvelHeroes`);
      return response.data;
    }
  },
  
  getHero: async (id: string): Promise<MarvelHero> => {
    try {
      const response = await axios.get<MarvelHero>(`${LOCAL_API_URL}/MarvelHeroes/${id}`);
      return response.data;
    } catch (error) {
      const response = await axios.get<MarvelHero>(`${DOCKER_API_URL}/MarvelHeroes/${id}`);
      return response.data;
    }
  }
};

export const RivalsPlayerStatsService = {
  getPlayerStats: async (uid: string): Promise<RivalsPlayerStats> => {
    return apiRequest<RivalsPlayerStats>(`/RivalsPlayerStats/uid/${uid}`);
  },
  
  getPlayerSummary: async (uid: string): Promise<PlayerSummary> => {
    return apiRequest<PlayerSummary>(`/RivalsPlayerStats/summary/${uid}`);
  },
  
  getPlayerName: async (uid: string): Promise<{ uid: string; username: string }> => {
    return apiRequest<{ uid: string; username: string }>(`/RivalsPlayerStats/name/${uid}`);
  },
  
  getPlayerUpdateInfo: async (uid: string): Promise<PlayerUpdateInfo> => {
    return apiRequest<PlayerUpdateInfo>(`/RivalsPlayerStats/updates/${uid}`);
  },
  
  requestPlayerUpdate: async (uid: string): Promise<PlayerUpdateResponse> => {
    return apiRequest<PlayerUpdateResponse>(`/RivalsPlayerStats/update/${uid}`);
  }
};

export const PlayerNameService = {
  getPlayerNameByUid: async (uid: string): Promise<{ uid: string; username: string }> => {
    return apiRequest<{ uid: string; username: string }>(`/PlayerName/uid/${uid}`);
  }
};

export interface RivalsPlayerStats {
  uid: number;
  name: string;
  username: string;
  rank: string;
  level: number;
  matches: number;
  wins: number;
  losses: number;
  winrate: number;
  isPrivate: boolean;
  player?: {
    uid: number;
    level: string;
    name: string;
    rank?: {
      rank: string;
      image?: string;
      color?: string;
    };
    icon?: {
      playerId: string;
      iconUrl: string;
    };
  };
  overallStats?: {
    totalMatches: number;
    totalWins: number;
  };
  updates?: {
    infoUpdateTime: string;
    lastHistoryUpdate?: string;
    lastInsertedMatch?: string;
    lastUpdateRequest?: string;
  };
}

export interface PlayerSummary {
  uid: string;
  username: string;
  level: number;
  rank: string;
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  winrate: number;
  avatar?: string;
}

export interface PlayerUpdateInfo {
  uid: string;
  username: string;
  infoUpdateTime?: string;
  lastHistoryUpdate?: string;
  lastInsertedMatch?: string;
  lastUpdateRequest?: string;
}

export interface PlayerUpdateResponse {
  uid: string;
  username: string;
  success: boolean;
  message: string;
  lastUpdateRequest?: string;
  warning?: string;
}

async function apiRequest<T>(endpoint: string, options?: any): Promise<T> {
  try {
    const response = await axios(`${LOCAL_API_URL}${endpoint}`, options);
    return response.data;
  } catch (error) {
    console.log('Local API not available, trying Docker environment...');
    const response = await axios(`${DOCKER_API_URL}${endpoint}`, options);
    return response.data;
  }
}

export default { PlayerService, MarvelHeroService, RivalsPlayerStatsService, PlayerNameService };