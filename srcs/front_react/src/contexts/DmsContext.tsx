import React, { createContext, useEffect, useState } from "react";
import { IConvCreated } from "../components/chat/types";
import { api } from "../const/const";

export type DmsContextType = {
  dmsList: IConvCreated[];
  setDmsList: (dmsList: IConvCreated[]) => void;
  getDmsList: () => void;
};

export const DmsContext = createContext<DmsContextType>({
  dmsList: [],
  setDmsList: () => {},
  getDmsList: () => {},
});

interface DmsContextProps {
  children: JSX.Element | JSX.Element[];
}

export const DmsProvider = ({ children }: DmsContextProps) => {

  const [dmsList, setDmsList] = useState<IConvCreated[]>([]);

  // get all dms
  async function getDmsList() {
    console.log("get dms");
    await api
      .get("dm/list", {
        params: {
          offset: 0,
        },
      })
      .then((res) => {
        setDmsList(res.data);
      })
      .catch((res) => {
        console.log("invalid dms");
        console.log(res);
      });
  }

  // get all Dms
  useEffect(() => {
    getDmsList();
  }, []);

  return (
    <DmsContext.Provider
      value={{
        dmsList,
        setDmsList,
        getDmsList,
      }}
    >
      {children}
    </DmsContext.Provider>
  );
};
