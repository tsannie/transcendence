//changer ca en dto

export interface IMessage {
	id: number; // id du dm
	author: string;
	content: string;
	target: string;
	isDm: boolean;
}