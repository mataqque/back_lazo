export interface IUserRequestGoogle {
	username?: string;
	firstname?: string;
	email?: string;
	// role?: number;
}

export interface IUserGoogle {
	id: number;
	username: string;
	email: string;
	provider: string;
	password?: null;
	resetPasswordToken?: null;
	confirmationToken?: null;
	confirmed: boolean;
	blocked: boolean;
	createdAt: string;
	updatedAt: string;
	attempts?: null;
	firstname: string;
	lastname?: null;
	cel?: null;
	google_id: string;
	role?: null;
}

export interface IUserDatabase {
	id: number;
	username: string;
	email: string;
	provider: string;
	password?: null | string;
	resetPasswordToken?: null;
	confirmationToken?: null;
	confirmed: boolean;
	blocked: boolean;
	createdAt: string;
	updatedAt: string;
	attempts: number;
	firstname: string;
	lastname?: null;
	phone?: {
		phone: string;
		verified: boolean;
	};
	code: string;
	google_id: string;
	gender?: string;
	birthday?: null;
	role?: null;
}
