

export const tabs = [
  {
    id: "troops",
    label: "Troops",
    children: [
      { id: "home-troops", label: "Home Village" },
      { id: "builder-troops", label: "Builder Base" },
    ],
  },
  { id: "spells", label: "Spells" },
  {
    id: "heroes",
    label: "Heroes",
    children: [
      { id: "home-heroes", label: "Home Village" },
      { id: "builder-heroes", label: "Builder Base" },
    ],
  },
  { id: "equipment", label: "Equipment" },
  {
    id: "achievements",
    label: "Achievements",
    children: [
      { id: "home-achievements", label: "Home Village" },
      { id: "builder-achievements", label: "Builder Base" },
    ],
  },
];

 export const achievements = [
  {
    name: "Bigger Coffers",
    description: "Upgrade a Gold Storage to level 10",
    current: 12,
    target: 10,
    type: "Home Village",
  },
  {
    name: "Get even more Goblins!",
    description: "Win 270 Stars on the Campaign Map",
    current: 142,
    target: 270,
    type: "Home Village",
  },
  {
    name: "Bigger & Better",
    description: "Upgrade Town Hall to level 8",
    current: 11,
    target: 8,
    type: "Home Village",
  },
  {
    name: "Gold Grab",
    description: "Steal 100000000 Gold",
    current: 173978412,
    target: 100000000,
    type: "Builder Base",
  },
  {
    name: "Master Builder",
    description: "Upgrade Builder Hall to level 9",
    current: 8,
    target: 9,
    type: "Builder Base",
  },
];
