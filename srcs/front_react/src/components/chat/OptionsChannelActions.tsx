import { AxiosResponse } from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { IMemberProps } from "./OptionsChannel";

function UserOptions(props: IMemberProps) {
    const {type, isOwner, isAdmin, channelId, user} = props;
    const [isOpen, setOpen ] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownStyle = useRef<React.CSSProperties>()

    const banUser = async () => {
        await api
        .post("/channel/ban", { id: channelId, targetId: user.id })
        .then(() => toast.success(`${user.username} has been banned`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const unBanUser = async () => {
        await api
        .post("/channel/unban", { id: channelId, targetId: user.id })
        .then(() => toast.success(`${user.username} has been unbanned`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const muteUser = async () => {
        await api
        .post("/channel/mute", { id: channelId, targetId: user.id })
        .then(() => toast.success(`${user.username} has been muted`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const unMuteUser = async () => {
        await api
        .post("/channel/unmute", { id: channelId, targetId: user.id })
        .then(() => toast.success(`${user.username} has been unmuted`))
        .catch((error: any) => toast.error("HTTP error:" + error.response.data.message));
    }

    const makeAdmin = async () => {
        await api
        .post("/channel/makeAdmin", { id: channelId, targetId: user.id })
        .then(() => toast.success(`${user.username} is now an admin`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const revokeAdmin = async () => {
        await api
        .post("/channel/revokeAdmin", { id: channelId, targetId: user.id })
        .then(() => toast.success(`${user.username} is no more an admin`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const adminOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isOwner){
            adminOptionsJSX.push(<button key={1} onClick={banUser}>Ban</button>);
            adminOptionsJSX.push(<button key={2} onClick={muteUser}>Mute</button>);
            adminOptionsJSX.push(<button key={3} onClick={revokeAdmin}>Revoke Admin</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    const memberOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isOwner)
            adminOptionsJSX.push(<button key={3} onClick={makeAdmin}>Make Admin</button>)
        if (isOwner || isAdmin){
            adminOptionsJSX.push(<button key={1} onClick={banUser}>Ban</button>);
            adminOptionsJSX.push(<button key={2} onClick={muteUser}>Mute</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    const mutedOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isAdmin || isOwner){
            adminOptionsJSX.push(<button key={1} onClick={unMuteUser}>Unmute</button>);
            adminOptionsJSX.push(<button key={2} onClick={banUser}>Ban</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    const bannedOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isAdmin || isOwner){
            adminOptionsJSX.push(<button key={1} onClick={unBanUser}>UnBan</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    // TODO: button redirect to profile page of user
    const displayOptions = () => {
        console.log(dropdownStyle);
        return (
        <div className="dropdown" style={dropdownStyle.current}>
            <div className="options">Options</div>
            <button>Profile</button>
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

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        let pos = (event.target as HTMLElement).getBoundingClientRect();
        let x = event.clientX - pos.left;
        let y = event.clientY - pos.top;
        dropdownStyle.current = {
            left: x,
            top: 2 * y,
        }
        setOpen(true);
    }

    return (
    <Fragment>
        <button ref={buttonRef} className="member" onClick={(e) => handleButtonClick(e)}>
            <img src={user.profile_picture} />
        </button>
        {isOpen ? displayOptions() : null}
    </Fragment>);
}

export default UserOptions;
