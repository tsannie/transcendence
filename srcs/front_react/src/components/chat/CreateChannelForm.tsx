function CreateChannelForm () {
    return (<div className="create__channel">
            <h2>CREATE CHANNEL</h2>
            <form>
                <input type="text" placeholder="Enter Name of New Channel..." />
                <div className="create__chan__status">
                    <button>public</button>
                    <button>private</button>
                    <button>protected</button>
                </div>
            </form>
        </div>)
}

export default CreateChannelForm;