import { Fragment, useState } from "react";
import { User } from "../../contexts/AuthContext";

function UserOptions(props: {type: string, isOwner: boolean, isAdmin: boolean, user: User}) {
    const {type, isOwner, isAdmin, user} = props;
    const [isOpen, setOpen] = useState<boolean>(false);
    
    const adminOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];
        if (isOwner){
            adminOptionsJSX.push(<button>Ban User</button>);
            adminOptionsJSX.push(<button>Mute User</button>);
            adminOptionsJSX.push(<button>Revoke Admin</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    const memberOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isAdmin){    
            adminOptionsJSX.push(<button>Ban User</button>);
            adminOptionsJSX.push(<button>Mute User</button>);
        }
        if (isOwner)
            adminOptionsJSX.push(<button>Make Admin</button>)
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    const mutedOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isAdmin || isOwner){    
            adminOptionsJSX.push(<button>Unmute User</button>);
            adminOptionsJSX.push(<button>Ban User</button>);
        }
        return <Fragment>{adminOptionsJSX}</Fragment>;
    }

    const bannedOptions = () => {
        let adminOptionsJSX: JSX.Element[] = [];

        if (isAdmin || isOwner){    
            adminOptionsJSX.push(<button>UnBan User</button>);
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

    return (
    <Fragment>
        <button className="member" onClick={(e: any) => {console.log(e); setOpen(true);}}>
            <img src={user.profile_picture} />
        </button>
        {isOpen ? displayOptions() : null}
    </Fragment>);
}

export default UserOptions;
