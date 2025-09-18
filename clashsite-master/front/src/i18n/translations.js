export const translations = {
  en: {
    languageName: "English",
    direction: "ltr",
    nav: {
      home: "Home",
      xpCalculator: "XP Calculator",
      donations: "Donations Ranking",
      strategyHub: "Strategy Hub",
      clans: {
        label: "Clans",
        searchByTag: "Search Clan by Tag",
      },
      players: {
        label: "Players",
        searchByTag: "Search Player by Tag",
        searchByClan: "Search Players by Clan Tag",
      },
      yourAccount: "Your Account",
    },
    hero: {
      headline: "Search by clan tag, player, or location",
    },
    buttons: {
      search: "Search",
    },
    status: {
      loading: "Loading...",
    },
    search: {
      player: {
        placeholder: "Enter player tag (e.g. #YRUYL22)",
        errors: {
          missingTag: "Please enter a player tag.",
          fetchFailed: "Failed to load player.",
        },
        labels: {
          name: "Name",
          tag: "Tag",
          trophies: "Trophies",
          level: "Level",
          clan: "Clan",
          role: "Role",
          donations: "Donations",
        },
        badgeAlt: "Player clan badge",
        sections: {
          troops: "Troops",
          spells: "Spells",
          heroes: "Heroes",
          equipment: "Equipment",
          achievements: "Achievements",
        },
        fallbacks: {
          unknownPlayer: "Unknown player",
          noClan: "No clan",
        },
      },
      clan: {
        placeholder: "Enter clan tag (e.g. #YRUYL22)",
        errors: {
          missingTag: "Please enter a clan tag.",
          fetchFailed: "Failed to load clan.",
        },
        labels: {
          name: "Clan name",
          tag: "Tag",
          level: "Level",
          description: "Description",
        },
        messages: {
          noDescription: "No description",
          errorTitle: "Something went wrong",
          tryAgain: "Try again",
        },
      },
      location: {
        placeholder: "Select a location",
        errors: {
          fetchFailed: "Failed to load clans.",
        },
        labels: {
          rank: "Rank",
          level: "Clan level",
        },
      },
      playersInClan: {
        placeholder: "Enter clan tag (e.g. #YRUYL22)",
        heading: "Clan Members",
        errors: {
          missingTag: "Please enter a clan tag.",
          fetchFailed: "Failed to fetch clan members.",
        },
        info: {
          tag: "Tag",
          level: "Level",
          members: "Members",
        },
        tableHeaders: {
          league: "League",
          name: "Name",
          tag: "Tag",
          level: "Level",
          role: "Role",
          trophies: "Trophies",
          donations: "Donations",
          received: "Received",
          townHall: "Town Hall",
        },
      },
    },
  },
};

export const fallbackLanguage = "en";
