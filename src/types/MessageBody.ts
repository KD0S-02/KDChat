export type Group = {
    groupName: string,
    groupId: string
}

export type MessageBody = {
    type: "authentication" | "message" | "createRoom" | "joinRoom" | "leaveRoom" | "groupList",
    roomId?: string,
    data?: string | Group[],
    username?: string,
}

export default MessageBody;

