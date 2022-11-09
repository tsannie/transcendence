import { Fragment, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import { IDm } from "./types";

function DmOptions() {
  const { currentConv } = useContext(ChatDisplayContext);
  const [dm, setDm] = useState<IDm>({} as IDm);

  const loadDm = async () => {
    await api
      .get("dm/datas")
      .then((res) => {
        console.log(res.data);
        setDm(res.data);
      })
      .catch((err) => {toast.error("HTTP error:" + err)});
  };

  useEffect(() => {
    const async_fct = async () => { await loadDm() };

    async_fct();
  }, []);

  return <Fragment>
      <div className="conversation__options__title">
      </div>
    </Fragment>
}

function ChannelOptions() {
  return <Fragment></Fragment>
}

function Options() {
  const { isChannel } = useContext(ChatDisplayContext);

  return (
    <div className="conversation__options">
      {isChannel? <ChannelOptions /> : <DmOptions />}
    </div>
  );
}

export default Options;
