import { UserDTO } from "../com.dto/userDTO";

export interface UserService {
    addUser(userDetails:UserDTO):Promise<number>;
}