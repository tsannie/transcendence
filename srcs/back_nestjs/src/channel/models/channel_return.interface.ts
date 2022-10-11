import { ChannelEntity } from "./channel.entity";

export interface IChannelReturn {
    status: string;
    data: ChannelEntity;
}