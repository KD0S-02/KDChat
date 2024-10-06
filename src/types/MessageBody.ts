export type MessageBody = {
    type: "authentication" | "message" | "createRoom" | "joinRoom" | "leaveRoom",
    roomId: string | null,
    data: string,
}

export default MessageBody;

