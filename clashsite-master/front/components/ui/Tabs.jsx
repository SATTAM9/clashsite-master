import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import MySelectByCountry from "../search/MySelectByCountry.jsx";

const taps = [
  { name: "Locations", content: <MySelectByCountry /> },
  { name: "Player", content: <MySelectByCountry /> },
  { name: "Clan", content: <MySelectByCountry /> },
];

export default function Tabs() {
  return (
    <div className="flex mb-[30px] w-full justify-center px-4 pt-24">
      <div className="w-full max-w-md">
        <TabGroup>
          <TabList className="flex justify-evenly items-center ">
            {taps.map(({ name }) => (
              <Tab
                key={name}
                className="rounded-full px-3 py-1 text-sm/6 font-semibold text-white
                           focus:not-data-focus:outline-none
                           data-focus:outline data-focus:outline-white
                           data-hover:bg-white/5
                           data-selected:bg-white/10
                           data-selected:data-hover:bg-white/10"
              >
                {name}
              </Tab>
            ))}
            <p className="text-white text-[13px] opacity-[.8]">
              look up for clans or plays
            </p>
          </TabList>
          <TabPanels className="mt-3 ">
            {taps.map(({ name, content }) => (
              <TabPanel
                key={name}
                className="rounded-xl h-[100%]  mt-3 bg-white/5"
              >
                {content}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
