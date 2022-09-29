export interface IMessage {
	id: string;
	author?: string;
	content: string;
	createdAt: Date;
	channel?: string;
	target?: string;
}