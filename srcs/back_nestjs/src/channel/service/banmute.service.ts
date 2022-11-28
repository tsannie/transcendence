import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/models/user.entity";
import { Repository } from "typeorm";
import { BanEntity, BanMuteEntity, MuteEntity } from "../models/ban.entity";
import { ChannelEntity } from "../models/channel.entity";

@Injectable()
export class BanMuteService {
    constructor (
        @InjectRepository(MuteEntity)
        private muteRepository: Repository<MuteEntity>,
        @InjectRepository(BanEntity)
        private banRepository: Repository<BanEntity>
    ) {}

    async generate<T extends MuteEntity | BanEntity>(c : new() => T, duration: number, channel: ChannelEntity, target: UserEntity) : Promise<T>{
        let new_action = new c();
        
		new_action.user = target;
		new_action.date = new Date();
        new_action.channel = channel;

        if (duration)
        {
            let time_of_end = new Date();
            let duration_in_ms = duration * 60 * 1000;
            time_of_end.setTime(new_action.date.getTime() + duration_in_ms);
            new_action.end = time_of_end;
        }
        else
            new_action.end = null;

        if (new_action instanceof BanEntity)
		    return await this.banRepository.save(new_action);
        else
            return await this.muteRepository.save(new_action);
    }

    async remove(c: BanEntity | MuteEntity) : Promise<BanEntity | MuteEntity> {
        if (c instanceof BanEntity)
            return await this.banRepository.remove(c);
        else
            return await this.muteRepository.remove(c);
    }

    async isMuted(channel : ChannelEntity, user: UserEntity) : Promise<MuteEntity | boolean> {
        let request = await this.muteRepository
        .createQueryBuilder("mute")
        .select("mute.id")
        .addSelect("mute.end")
        .leftJoin("mute.user", "user")
        .addSelect("user.id")
        .leftJoin("mute.channel", "channel")
        .addSelect("channel.id")
        .where("mute.user.id = :user_id", {user_id: user.id})
        .andWhere("mute.channel.id = :channel_id", {channel_id: channel.id})
        .getOne()
        
        if (request)
        {
            if (!this.checkDuration(request))
				return true;
			else
				return await this.remove(request) as MuteEntity;
        }
        else
            return false;
    }

    checkDuration(ban_mute: BanMuteEntity) : boolean
	{
		let current_date : Date = new Date();

		if (ban_mute.end && current_date >= ban_mute.end)
			return true;
		else
			return false;
	}
    
}