import { AxiosResponse } from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import BanMuteButton from "./OptionsBanMute";
import { IMemberProps } from "./OptionsChannel";

function UserOptions(props: IMemberProps) {
    const {type, isOwner, isAdmin, channelId, user} = props;
    const [isOpen, setOpen ] = useState<boolean>(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const dropdownStyle = useRef<React.CSSProperties>()

    const unBanUser = async () => {
        await api
        .post("/channel/unban", { id: channelId, targetId: user.id })
        .then(() => toast.info(`${user.username} has been unbanned`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const unMuteUser = async () => {
        await api
        .post("/channel/unmute", { id: channelId, targetId: user.id })
        .then(() => toast.info(`${user.username} has been unmuted`))
        .catch((error: any) => toast.error("HTTP error:" + error.response.data.message));
    }

    const makeAdmin = async () => {
        await api
        .post("/channel/makeAdmin", { id: channelId, targetId: user.id })
        .then(() => toast.info(`${user.username} is now an admin`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const revokeAdmin = async () => {
        await api
        .post("/channel/revokeAdmin", { id: channelId, targetId: user.id })
        .then(() => toast.info(`${user.username} is no more an admin`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const adminOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isOwner){
            let key : number = 2;
            adminOptionsJSX.push(<button key={key++} onClick={revokeAdmin}>unAdmin</button>);
            adminOptionsJSX.push(<BanMuteButton key={key++} type="Mute" channelId={channelId} user={user} /> )
            adminOptionsJSX.push(<BanMuteButton key={key++} type="Ban" channelId={channelId} user={user} /> )
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    const memberOptions = () => {
        let key : number = 2;
        let adminOptionsJSX: JSX.Element[] = [];

        if (isOwner)
            adminOptionsJSX.push(<button key={key++} onClick={makeAdmin}>make Admin</button>)
        if (isOwner || isAdmin){
            adminOptionsJSX.push(<BanMuteButton key={key++} type="Mute" channelId={channelId} user={user} /> );
            adminOptionsJSX.push(<BanMuteButton key={key++} type="Ban" channelId={channelId} user={user} /> );
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    const mutedOptions = () => {
        let key : number = 2;
        let adminOptionsJSX: JSX.Element[] = [];

        if (isAdmin || isOwner){
            adminOptionsJSX.push(<button key={key++} onClick={unMuteUser}>Unmute</button>);
            adminOptionsJSX.push(<BanMuteButton key={key++} type="Ban" channelId={channelId} user={user} /> );
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    const bannedOptions = () => {
        let key : number = 2;
        let adminOptionsJSX: JSX.Element[] = [];

        if (isAdmin || isOwner){
            adminOptionsJSX.push(<button key={key++} onClick={unBanUser}>UnBan</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    // TODO: button redirect to profile page of user
    const displayOptions = () => {
        return (
        <div className="dropdown" style={dropdownStyle.current}>
            <div className="options">{user.username}</div>
            <button key={1}>
                <Link style={{textDecoration: 'none'}} to={"/profile/" + user.username}>
                    Profile
                </Link>
            </button>
            {type === "Admins" && adminOptions()}
            {type === "Members" && memberOptions()}
            {type === "Muted" && mutedOptions()}
            {type === "Banned" && bannedOptions()}
        </div>);
    }

    useEffect(() => {
        const closeDropdown = (e: any) => {
            if (!e.composedPath().includes(buttonRef.current))
                setOpen(false);
        };

        document.body.addEventListener("click", closeDropdown);
        return () => document.body.removeEventListener("click", closeDropdown);
    }, [])

    const handleButtonClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        let pos = (event.target as HTMLElement).getBoundingClientRect();

        const rec = buttonRef.current?.closest("div.conversation__options__members")?.getBoundingClientRect();
        const mouseX = event.clientX;

        if (mouseX && rec?.right && ((rec.right - rec.x) / 2 < ( mouseX - rec.x))) {
            let x = pos.right - event.clientX;
            let y = event.clientY - pos.top;
            dropdownStyle.current = {
                right: x,
                top: y,
            }
        }
        else{
            let x = event.clientX - pos.left;
            let y = event.clientY -  pos.top;
            dropdownStyle.current = {
                left: x,
                top: y,
            }
        }
        setOpen(true);
    }

    return (
    <Fragment>
        <div ref={buttonRef} className="members" onClick={(e) => handleButtonClick(e)}>
            <img src={user.profile_picture} />
            {isOpen ? displayOptions() : null}
        </div>
    </Fragment>);
}

export default UserOptions;
