export const defaultWheelsData = {
  bossing: {
    id: 'bossing',
    title: 'Bossing',
    tasks: [
      { id: 'b1', name: 'Zulrah', category: 'Solo Boss', defaultEnabled: true },
      { id: 'b2', name: 'Vorkath', category: 'Solo Boss', defaultEnabled: true },
      { id: 'b3', name: 'Commander Zilyana', category: 'God Wars', defaultEnabled: true },
      { id: 'b4', name: 'General Graardor', category: 'God Wars', defaultEnabled: true },
      { id: 'b5', name: 'K\'ril Tsutsaroth', category: 'God Wars', defaultEnabled: true },
      { id: 'b6', name: 'Kree\'arra', category: 'God Wars', defaultEnabled: true },
      { id: 'b7', name: 'Cerberus', category: 'Slayer Boss', defaultEnabled: false },
      { id: 'b8', name: 'Alchemical Hydra', category: 'Slayer Boss', defaultEnabled: false },
      { id: 'b9', name: 'Phosani\'s Nightmare', category: 'Solo Boss', defaultEnabled: false },
      { id: 'b10', name: 'Chambers of Xeric', category: 'Raid', defaultEnabled: true },
      { id: 'b11', name: 'Theatre of Blood', category: 'Raid', defaultEnabled: false },
      { id: 'b12', name: 'Tombs of Amascut', category: 'Raid', defaultEnabled: true },
    ],
    configOptions: {
      killCountRange: { min: 1, max: 50, currentMin: 5, currentMax: 25 }
    }
  },
  skilling: {
    id: 'skilling',
    title: 'Skilling',
    tasks: [
      { id: 's1', name: 'Woodcutting (AFK Yews/Magics)', category: 'AFK', defaultEnabled: true },
      { id: 's2', name: 'Woodcutting (2-Tick Teaks)', category: 'Active', defaultEnabled: false },
      { id: 's3', name: 'Fishing (Barbarian)', category: 'AFK', defaultEnabled: true },
      { id: 's4', name: 'Fishing (Tempoross)', category: 'Minigame', defaultEnabled: true },
      { id: 's5', name: 'Mining (Motherlode Mine)', category: 'AFK', defaultEnabled: true },
      { id: 's6', name: 'Mining (Volcanic Mine)', category: 'Minigame', defaultEnabled: false },
      { id: 's7', name: 'Agility (Rooftops)', category: 'Active', defaultEnabled: true },
      { id: 's8', name: 'Agility (Hallowed Sepulchre)', category: 'Active', defaultEnabled: false },
      { id: 's9', name: 'Runecrafting (Guardians of the Rift)', category: 'Minigame', defaultEnabled: true },
      { id: 's10', name: 'Runecrafting (ZMI)', category: 'AFK', defaultEnabled: true },
      { id: 's11', name: 'Firemaking (Wintertodt)', category: 'Minigame', defaultEnabled: true },
      { id: 's12', name: 'Thieving (Pickpocketing Ardy Knights)', category: 'Active', defaultEnabled: true },
      { id: 's13', name: 'Thieving (Stealing Artefacts)', category: 'Active', defaultEnabled: false },
    ],
    configOptions: {
      timeLimitMinutes: { min: 15, max: 120, current: 60 }
    }
  },
  other: {
    id: 'other',
    title: 'Other Activities',
    tasks: [
      { id: 'o1', name: 'Pest Control', category: 'Minigame', defaultEnabled: true },
      { id: 'o2', name: 'Barbarian Assault', category: 'Minigame', defaultEnabled: false },
      { id: 'o3', name: 'Barrows Runs', category: 'Minigame', defaultEnabled: true },
      { id: 'o4', name: 'Easy Clue Scrolls', category: 'Clues', defaultEnabled: true },
      { id: 'o5', name: 'Medium Clue Scrolls', category: 'Clues', defaultEnabled: true },
      { id: 'o6', name: 'Hard Clue Scrolls', category: 'Clues', defaultEnabled: true },
      { id: 'o7', name: 'Elite/Master Clue Scrolls', category: 'Clues', defaultEnabled: false },
      { id: 'o8', name: 'Wilderness PKing (Revs)', category: 'PvP', defaultEnabled: false },
      { id: 'o9', name: 'LMS (Last Man Standing)', category: 'PvP', defaultEnabled: false },
      { id: 'o10', name: 'Soul Wars', category: 'Minigame', defaultEnabled: false },
      { id: 'o11', name: 'Questing', category: 'Account Progression', defaultEnabled: true },
      { id: 'o12', name: 'Achievement Diaries', category: 'Account Progression', defaultEnabled: true }
    ],
    configOptions: {}
  }
};
