


// Donations.jsx
import { createContext, useContext, useState } from "react";
import Clansdonatin from "./clansdonatin/Clansdonatin";

const ClansContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useClans = () => useContext(ClansContext);

const Donations = () => {
  const [cachedClans, setCachedClans] = useState(null);

  return (
    <ClansContext.Provider value={{ cachedClans, setCachedClans }}>
      <Clansdonatin />
    </ClansContext.Provider>
  );
};

export default Donations;
