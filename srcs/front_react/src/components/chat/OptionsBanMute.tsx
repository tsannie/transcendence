import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { User } from "../../contexts/AuthContext";

export interface IMuteBan {
    id: string,
    targetId: string,
    duration: number,
}

function BanMuteButton(props: {key: number, type : string, channelId: string, user : User}) {
    const { key, type, channelId, user } = props;
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
        setTimerOption(true);
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
                <button key={key} onClick={createTimer}>{type}</button>
                : 
                <Fragment>
                    <button key={key}>{type}</button>
                    <form onSubmit={handleAction}>
                        <input
                            type="number"
                            min="0"
                            placeholder="minutes"
                            value={timer}
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