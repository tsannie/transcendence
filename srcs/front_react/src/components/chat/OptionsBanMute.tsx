import { Fragment, useEffect, useState } from "react";

function BanMuteButton(props: {key: number, type : string, onClickEvent: () => Promise<void>}) {
    const [ timer, setTimer ] = useState<number>(0);
    const [timerOption, setTimerOption ] = useState<boolean>(false);

    useEffect( () => {
        setTimerOption(false);
        setTimer(0);
    }, [])

    const createTimer = () => {
        setTimerOption(true);
    }

    return (
        <Fragment>
            {
                !timerOption ? 
                <button key={props.key} onClick={createTimer}>Mute</button>
                : 
                <Fragment>
                    <button key={props.key}>Mute</button>
                    <form onSubmit={props.onClickEvent}>
                        <input
                            type="number"
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