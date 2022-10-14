//changer ca en dto

export interface IMessage {
	id: number; // id du dm
	author: any;
	content: string;
	target: string;
	isDm: boolean;
}