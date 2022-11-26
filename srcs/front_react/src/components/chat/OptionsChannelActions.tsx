import { AxiosResponse } from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { IMemberProps } from "./OptionsChannel";

function UserOptions(props: IMemberProps) {
    const {type, isOwner, isAdmin, channelId, user} = props;
    const [isOpen, setOpen ] = useState<boolean>(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const dropdownStyle = useRef<React.CSSProperties>()

    const banUser = () => {
        api
        .post("/channel/ban", { id: channelId, targetId: user.id })
        .then(() => toast.success(`${user.username} has been banned`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const unBanUser = () => {
        api
        .post("/channel/unban", { id: channelId, targetId: user.id })
        .then(() => toast.success(`${user.username} has been unbanned`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const muteUser = () => {
        api
        .post("/channel/mute", { id: channelId, targetId: user.id })
        .then(() => toast.success(`${user.username} has been muted`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const unMuteUser = () => {
        api
        .post("/channel/unmute", { id: channelId, targetId: user.id })
        .then(() => toast.success(`${user.username} has been unmuted`))
        .catch((error: any) => toast.error("HTTP error:" + error.response.data.message));
    }

    const makeAdmin = () => {
        api
        .post("/channel/makeAdmin", { id: channelId, targetId: user.id })
        .then(() => toast.success(`${user.username} is now an admin`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const revokeAdmin = () => {
        api
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
        return (
        <div className="dropdown" style={dropdownStyle.current}>
            <div className="options">{user.username}</div>
            <button>
                <Link to={"/profile/" + user.username}>
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

        console.log(rec?.right, rec?.x, mouseX)
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
