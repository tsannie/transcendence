import { useContext, useState } from "react";
import { api } from "../../const/const";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import { ICreateChannel } from "./types";
import {ChatType} from "../../contexts/ChatDisplayContext";

function CreateChannelForm () {
    const {changeDisplay, changeCurrentConv, changeIsChannel, changeNewConv} = useContext(ChatDisplayContext);

    const [channelName, setChannelName] = useState<string>('');
    const [channelStatus, setChannelStatus] = useState<string>('');
    const [channelPassword, setChannelPassword] = useState<string>('');
    const [passwordVerifier, setPasswordVerifier] = useState<string>('');

    const createChannel = async (event: any) => {
        event.preventDefault();
        if ( channelPassword.length > 0 && channelPassword !== passwordVerifier) {
            console.log("Passwords don't match"); //TODO SNACKBAR ERROR
            return;
        }
        const channel: Partial<ICreateChannel> = {
            name: channelName,
            status: channelStatus,
        }
        if (channelStatus === "Protected")
            channel.password = channelPassword;

        await api
            .post("channel/create", channel)
            .then((res) => {
                changeDisplay(ChatType.CONV);
                changeCurrentConv(res.data.id);
                changeIsChannel(true);
                changeNewConv(res.data);
            })
            .catch( (err) => console.log(err.response.data));
    }

    const actualizeChannelName = (event: any) => {
        setChannelName(event.target.value);
    }

    const actualizeChannelPassword = (event: any) => {
        setChannelPassword(event.target.value);
    }

    const actualizePasswordVerifier = (event: any) => {
        setPasswordVerifier(event.target.value);
    }

    const selectStatus = (event: any) => {
        setChannelStatus(event.target.value);
    }

    return (<div className="create__channel">
                <h2>CREATE CHANNEL</h2>
                <form onSubmit={createChannel}>
                    <input type="text" placeholder="Enter Name of New Channel..." value={channelName} onChange={actualizeChannelName}/>
                    <div className="create__chan__status">
                        <button type="button" value="Public" onClick={selectStatus}>public</button>
                        <button type="button" value="Private" onClick={selectStatus}>private</button>
                        <button type="button" value="Protected" onClick={selectStatus}>protected</button>
                    </div>
                    { channelStatus === "Protected" &&
                            <div className="create__chan__passwords">
                                <input type="password" placeholder="Enter Password..." value={channelPassword} onChange={actualizeChannelPassword}/>
                                <input type="password" placeholder="Verify Password..." value={passwordVerifier} onChange={actualizePasswordVerifier}/>
                            </div>
                    }
                    <button className="create__chan__validator" onClick={createChannel}>create channel</button>
                </form>
        </div>)
}

export default CreateChannelForm;