import { AxiosResponse } from "axios";
import { Fragment, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { IMemberProps } from "./OptionsChannel";

function UserOptions(props: IMemberProps) {
    const {type, isOwner, isAdmin, isOpen, setOpen, channelId, user} = props;

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
        return (
        <div className="dropdown">
            <div className="options">Options</div>
            <button>Access Profile</button>
            {type === "Admins" && adminOptions()}
            {type === "Members" && memberOptions()}
            {type === "Muted" && mutedOptions()}
            {type === "Banned" && bannedOptions()}
        </div>);
    }

    useEffect( () => {
    }, [isOpen])

    return (
    <Fragment>
        <button className="member" onClick={(e) => {setOpen(true);}}>
            <img src={user.profile_picture} />
        </button>
        {isOpen ? displayOptions() : null}
    </Fragment>);
}

export default UserOptions;
