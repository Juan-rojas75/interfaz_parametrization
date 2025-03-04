import { User } from "src/User/db/model/user.model";

export class LoginResponseDto {

    status: number;
    message: string;
    error: boolean;
    data: {
        access_token: string
        refresh_token: string
        user: User
    };
}
