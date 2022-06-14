const Notification = ({ message, tone }) => {
    if(message === null){
        return null
    }

    return (
        <div className={`notif ${tone}`}>
            {message}
        </div>
    )
}

export default Notification