import { ChangeEvent, useContext, useEffect, useState } from "react";
import { api } from "../../const/const";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import { ICreateChannel } from "./types";
import { ChatType } from "../../contexts/ChatDisplayContext";
import { toast } from "react-toastify";

function CreateChannelForm() {
  const { setDisplay, setCurrentConv, setIsChannel, setNewConv } =
    useContext(ChatDisplayContext);

  const [channelName, setChannelName] = useState<string>("");
  const [channelStatus, setChannelStatus] = useState<string>("");
  const [channelPassword, setChannelPassword] = useState<string>("");
  const [passwordVerifier, setPasswordVerifier] = useState<string>("");
  const [selectType, setSelectType] = useState<
    "Public" | "Protected" | "Private"
  >("Public");

  const createChannel = async (event: any) => {
    event.preventDefault();
    if (channelPassword.length > 0 && channelPassword !== passwordVerifier) {
      toast.error("Passwords don't match");
      return;
    }
    const channel: Partial<ICreateChannel> = {
      name: channelName,
      status: selectType,
    };
    if (selectType === "Protected") channel.password = channelPassword;

    await api
      .post("channel/create", channel)
      .then((res) => {
        setCurrentConv(res.data.id);
        setIsChannel(true);
        setNewConv(res.data);
        setDisplay(ChatType.CONV);
      })
      .catch((err) => toast.error("HTTP error: " + err.response.data));
  };

  return (
    <div className="create__channel">
      <div className="create__channel__header">
        <h2>create channel</h2>
        <button onClick={() => setDisplay(ChatType.JOINFORM)}>join</button>
      </div>
      <form onSubmit={createChannel}>
        <input
          type="text"
          placeholder="Enter Name of New Channel..."
          value={channelName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setChannelName(e.target.value)
          }
        />
        <div className="create__chan__status">
          <button
            type="button"
            value="Public"
            onClick={() => setSelectType("Public")}
          >
            public
          </button>
          <button
            type="button"
            value="Private"
            onClick={() => setSelectType("Private")}
          >
            private
          </button>
          <button
            type="button"
            value="Protected"
            onClick={() => setSelectType("Protected")}
          >
            protected
          </button>
        </div>
        {selectType === "Protected" && (
          <div className="create__chan__passwords">
            <input
              type="password"
              placeholder="Enter Password..."
              value={channelPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setChannelPassword(e.target.value)
              }
            />
            <input
              type="password"
              placeholder="Verify Password..."
              value={passwordVerifier}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPasswordVerifier(e.target.value)
              }
            />
          </div>
        )}
        <button className="create__chan__validator" onClick={createChannel}>
          create channel
        </button>
      </form>
    </div>
  );
}

export default CreateChannelForm;
