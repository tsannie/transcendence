import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { User } from "../../contexts/AuthContext";

export interface IMuteBan {
    id: string,
    targetId: string,
    duration: number,
}

function BanMuteButton(props: {type : string, channelId: string, user : User}) {
    const { type, channelId, user } = props;
    const [ timer, setTimer ] = useState<number>(0);
    const [ timerOption, setTimerOption ] = useState<boolean>(false);

    const muteUser = async () => {
        let data : IMuteBan | Partial<IMuteBan>;

        if (timer === 0)
            data = {id: channelId, targetId: user.id};
        else
            data = {id: channelId, targetId: user.id, duration: timer};

        await api
        .post("/channel/mute", data)
        .then(() => toast.info(`${user.username} has been muted`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const banUser = async () => {
        let data : IMuteBan | Partial<IMuteBan>;

        if (timer === 0)
            data = {id: channelId, targetId: user.id};
        else
            data = {id: channelId, targetId: user.id, duration: timer};

        await api
        .post("/channel/ban", data)
        .then(() => toast.info(`${user.username} has been banned`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    useEffect( () => {
        setTimerOption(false);
        setTimer(0);
    }, [])

    const createTimer = () => {
        setTimerOption(!timerOption);
    }

    const handleAction = (event: any) => {
        event.preventDefault();
        if (type === "Mute")
            muteUser();
        else
            banUser();
        setTimer(0);
        setTimerOption(false);
    }

    return (
        <Fragment>
            {
                !timerOption ? 
                <button onClick={createTimer}>{type}</button>
                : 
                <Fragment>
                    <button onClick={createTimer}>{type}</button>
                    <form onSubmit={handleAction}>
                        <input
                            type="number"
                            min="1"
                            placeholder="minutes"
                            onChange={(e: any) =>
                                setTimer(e.target.value)
                            }
                        />
                    </form>
                </Fragment>
            }
        </Fragment>
    );
}

export default BanMuteButton;