import { UserEntity } from "src/user/models/user.entity";
import { ChannelEntity } from "./channel.entity";

export interface IChannelReturn {
    status: string;
    data: ChannelEntity;
}
