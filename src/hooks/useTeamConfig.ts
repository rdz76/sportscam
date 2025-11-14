import { useState, useEffect } from 'react';
import { TeamConfig, SportType } from '@/types/sports';

const STORAGE_KEY = 'pixlive_team_configs';

export const useTeamConfig = () => {
  const [savedConfigs, setSavedConfigs] = useState<TeamConfig[]>([]);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedConfigs(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading team configs:', error);
    }
  };

  const saveConfig = (homeTeam: string, awayTeam: string, sport: SportType, homeLogo?: string, awayLogo?: string) => {
    const newConfig: TeamConfig = {
      id: Date.now().toString(),
      name: `${homeTeam} vs ${awayTeam}`,
      homeTeam,
      awayTeam,
      sport,
      homeLogo,
      awayLogo,
      createdAt: Date.now(),
    };

    const updatedConfigs = [newConfig, ...savedConfigs].slice(0, 10); // Keep only last 10
    setSavedConfigs(updatedConfigs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfigs));
    
    return newConfig;
  };

  const deleteConfig = (id: string) => {
    const updatedConfigs = savedConfigs.filter(config => config.id !== id);
    setSavedConfigs(updatedConfigs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfigs));
  };

  return {
    savedConfigs,
    saveConfig,
    deleteConfig,
    loadConfigs,
  };
};
