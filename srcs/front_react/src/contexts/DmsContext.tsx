import React, { createContext, useContext, useEffect, useState } from "react";
import { IConvCreated, IDm } from "../components/chat/types";
import { api } from "../const/const";
import { AuthContext, AuthContextType } from "./AuthContext";

export type DmsContextType = {
  dmsList: IConvCreated[];
  setDmsList: (dmsList: IConvCreated[]) => void;
  getDmsList: () => void;
  dmData: any;
  setDmData: (dmData: any) => void;
  getDmDatas: (dm: any) => void;
};

export const DmsContext = createContext<DmsContextType>({
  dmsList: [],
  setDmsList: () => { },
  getDmsList: () => { },
  dmData: {},
  setDmData: () => { },
  getDmDatas: () => { },
});

interface DmsContextProps {
  children: JSX.Element | JSX.Element[];
}

export const DmsProvider = ({ children }: DmsContextProps) => {
  const [dmsList, setDmsList] = useState<IConvCreated[]>([]);
  const [dmData, setDmData] = useState<any>();
  const { user } = useContext(AuthContext) as AuthContextType;

  // find target username with conv id and user id
  function findTargetUsername(dmId: string) {
    let targetUsername = "";
    let dm = dmsList.find((dm) => dm.id === dmId);
    if (dm) {
      dm.users?.forEach((element) => {
        if (element.username !== user?.username) {
          targetUsername = element.username;
        }
      });
    }
    return targetUsername;
  }

  async function getDmDatas(dm: any) {
    await api
      .get("dm/getByTarget", {
        params: {
          target: findTargetUsername(dm.id),
        },
      })
      .then((res) => {
        console.log("get infos of channel clicked by user");
        setDmData(res.data);
      })
      .catch((res) => {
        console.log("invalid dm data");
        console.log(res.response.data.message);
      });
  }

  // get all dms
  async function getDmsList() {
    console.log("get dms");
    await api
      .get("dm/list")
      .then((res) => {
        setDmsList(res.data);
        console.log(res.data);
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
        dmData,
        setDmData,
        getDmDatas,
      }}
    >
      {children}
    </DmsContext.Provider>
  );
};
