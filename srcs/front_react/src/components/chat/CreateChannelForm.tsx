function CreateChannelForm () {
    const createChannel = (event: any) => {
        event.preventDefault();
        return ;
    }

    return (<div className="create__channel">
                <h2>CREATE CHANNEL</h2>
                <form onSubmit={createChannel}>
                    <input type="text" placeholder="Enter Name of New Channel..." />
                    <div className="create__chan__status">
                        <button>public</button>
                        <button>private</button>
                        <button>protected</button>
                    </div>
                </form>
                <button className="create__chan__validator">create channel</button>
        </div>)
}

export default CreateChannelForm;