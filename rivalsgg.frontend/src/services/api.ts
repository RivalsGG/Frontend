import axios from 'axios';

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

export default { PlayerService, MarvelHeroService };