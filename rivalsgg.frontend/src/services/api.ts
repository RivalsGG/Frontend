import axios from 'axios';

// Define types based on your backend models
export interface Player {
  playerId: number;
  playerName: string;
  playerAuthId: string;
  playerIcon: string;
  playerColor: string;
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'https://localhost:7123/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Player related API calls
export const PlayerService = {
  // Get all players
  getAllPlayers: async (): Promise<Player[]> => {
    const response = await api.get<Player[]>('/Player');
    return response.data;
  },
  
  // Get player by ID
  getPlayer: async (id: number): Promise<Player> => {
    const response = await api.get<Player>(`/Players/${id}`);
    return response.data;
  },
  
  // Create new player
  createPlayer: async (playerData: Omit<Player, 'playerId'>): Promise<Player> => {
    const response = await api.post<Player>('/Players', playerData);
    return response.data;
  },
  
  // Update player
  updatePlayer: async (id: number, playerData: Partial<Player>): Promise<Player> => {
    const response = await api.put<Player>(`/Players/${id}`, playerData);
    return response.data;
  },
  
  // Delete player
  deletePlayer: async (id: number): Promise<void> => {
    await api.delete(`/Players/${id}`);
  }
};

export default PlayerService;