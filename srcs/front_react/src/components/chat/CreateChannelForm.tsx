import { ChangeEvent, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import {
  ChatDisplayContext,
  ChatType,
} from "../../contexts/ChatDisplayContext";
import { ICreateChannel } from "./types";

function CreateChannelForm() {
  const {
    setDisplay,
    setCurrentConv,
    setIsChannel,
    setNewConv,
    setMuteDate,
    setMuted,
  } = useContext(ChatDisplayContext);

  const [channelName, setChannelName] = useState<string>("");
  const [channelPassword, setChannelPassword] = useState<string>("");
  const [passwordVerifier, setPasswordVerifier] = useState<string>("");
  const [selectType, setSelectType] = useState<string | null>(null);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (channelPassword.length > 0 && channelPassword !== passwordVerifier) {
      toast.error("Passwords don't match");
      return;
    }
    const channel: Partial<ICreateChannel> = {
      name: channelName,
      status: selectType as string,
    };
    if (selectType === "Protected") channel.password = channelPassword;

    api
      .post("channel/create", channel)
      .then((res) => {
        setMuted(false);
        setMuteDate(null);
        setCurrentConv(res.data.id);
        setIsChannel(true);
        setNewConv(res.data);
        setDisplay(ChatType.CONV);
      })
      .catch((err) => toast.error(err.response.data.message));
  };

  return (
    <div className="create__channel">
      <div className="create__channel__header">
        <h2>create channel</h2>
        <button onClick={() => setDisplay(ChatType.JOINFORM)}>join</button>
      </div>
      <form onSubmit={handleSubmit}>
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
            className={selectType === "Public" ? "selected" : ""}
            type="button"
            value="Public"
            onClick={() =>
              setSelectType(selectType !== "Public" ? "Public" : null)
            }
            disabled={!channelName}
          >
            public
          </button>
          <button
            className={selectType === "Private" ? "selected" : ""}
            type="button"
            value="Private"
            onClick={() =>
              setSelectType(selectType !== "Private" ? "Private" : null)
            }
            disabled={!channelName}
          >
            private
          </button>
          <button
            className={selectType === "Protected" ? "selected" : ""}
            type="button"
            value="Protected"
            onClick={() =>
              setSelectType(selectType !== "Protected" ? "Protected" : null)
            }
            disabled={!channelName}
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
              disabled={!channelName}
            />
            <input
              type="password"
              placeholder="Verify Password..."
              value={passwordVerifier}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPasswordVerifier(e.target.value)
              }
              disabled={!channelName}
            />
          </div>
        )}
        <button
          className="create__chan__validator"
          disabled={
            selectType === null ||
            (selectType === "Protected" &&
              (!channelPassword || channelPassword !== passwordVerifier)) ||
            !channelName
          }
        >
          create channel
        </button>
      </form>
    </div>
  );
}

export default CreateChannelForm;
