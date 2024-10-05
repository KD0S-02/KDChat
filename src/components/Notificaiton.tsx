type Props = {
    type: string,
    message: string
}

const Notificaiton = ({ type, message }: Props) => {

    return (
        <div className={`absolute left-1/2 transform -translate-x-1/2 top-10 rounded p-2 text-white text-center transition-all w-[30vw] mx-auto ${type === 'error' ? "bg-red-500" : type === 'success' ? "bg-green-600" : "bg-orange-400"}`}>{message}</div>
    )
}

export default Notificaiton