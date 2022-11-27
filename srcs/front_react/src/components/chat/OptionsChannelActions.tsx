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

    const banUser = () => {
        api
        .post("/channel/ban", { id: channelId, targetId: user.id })
        .then((res: AxiosResponse) => toast.success(`${user.username} has been banned`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const unBanUser = () => {
        api
        .post("/channel/unban", { id: channelId, targetId: user.id })
        .then((res: AxiosResponse) => toast.success(`${user.username} has been unbanned`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const muteUser = () => {
        api
        .post("/channel/mute", { id: channelId, targetId: user.id })
        .then((res: AxiosResponse) => toast.success(`${user.username} has been muted`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const unMuteUser = () => {
        api
        .post("/channel/unmute", { id: channelId, targetId: user.id })
        .then((res: AxiosResponse) => toast.success(`${user.username} has been unmuted`))
        .catch((error: any) => toast.error("HTTP error:" + error.response.data.message));
    }

    const makeAdmin = () => {
        api
        .post("/channel/makeAdmin", { id: channelId, targetId: user.id })
        .then((res: AxiosResponse) => toast.success(`${user.username} is now an admin`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const revokeAdmin = () => {
        api
        .post("/channel/revokeAdmin", { id: channelId, targetId: user.id })
        .then((res: AxiosResponse) => toast.success(`${user.username} is no more an admin`))
        .catch((error: any) => toast.error("HTTP error:" + error));
    }

    const adminOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isOwner){
            adminOptionsJSX.push(<button key={1} onClick={banUser}>Ban User</button>);
            adminOptionsJSX.push(<button key={2} onClick={muteUser}>Mute User</button>);
            adminOptionsJSX.push(<button key={3} onClick={revokeAdmin}>Revoke Admin</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    const memberOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isOwner)
            adminOptionsJSX.push(<button key={3} onClick={makeAdmin}>Make Admin</button>)
        if (isOwner || isAdmin){    
            adminOptionsJSX.push(<button key={1} onClick={banUser}>Ban User</button>);
            adminOptionsJSX.push(<button key={2} onClick={muteUser}>Mute User</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    const mutedOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isAdmin || isOwner){    
            adminOptionsJSX.push(<button key={1} onClick={unMuteUser}>Unmute User</button>);
            adminOptionsJSX.push(<button key={2} onClick={banUser}>Ban User</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    const bannedOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isAdmin || isOwner){    
            adminOptionsJSX.push(<button key={1} onClick={unBanUser}>UnBan User</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    const displayOptions = () => {
        console.log(dropdownStyle);
        return (
        <div className="dropdown" style={dropdownStyle.current}>
            <div className="options">Options</div>
            <button>Access Profile</button>
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
