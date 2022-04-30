import { AxiosResponse } from "axios";
import UserClient from "@/models/UserModels/User.client";
import UserCreate from "@/models/UserModels/User.create";
import UserLoginResponse from "@/models/UserModels/User.loginResponse";
import UserUpdate from "@/models/UserModels/User.update";
import BaseRepository from "./BaseRepository";
import IResponse from "./responses/IResponse";
import IResponseLogin from "./responses/IResponseLogin";
import IResponseGetOne from "./responses/IResponseGetOne";
import IResponseCreate from "./responses/IResponseCreate";
import IResponseDelete from "./responses/IResponseDelete";
import IResponseUpdate from "./responses/IResponseUpdate";


export default class UsersRepository extends BaseRepository<UserClient, UserCreate, UserUpdate> {

    /**
     * Login
     * Possible responses: is200, is400
     */
    public async login(userEmail: string, userPassword: string)  {
        const { data } = await this.axiosClient.post<IResponseLogin>("login", {
            userEmail: userEmail,
            userPassword: userPassword,
        });
        return data;
    }

    /**
     * Get self
     */
    public async getSelf() {
        const { data } = await this.axiosClient.get<IResponseGetOne<UserClient>>("self");
        return data;
    }
	
    /**
     * Delete self
     */
	 public async deleteSelf() {
		const { data } = await this.axiosClient.delete<IResponseDelete>("self");
        return data;
    }

    /**
     * Delete self
     */
	 public async updateSelf(model: UserUpdate) {
		const { data } = await this.axiosClient.patch<IResponseUpdate<UserClient>>("self", model);
        return data;
    }

    /**
     * Create a new item
     * Possible responses: is201, is400
     */
	 async create(model: UserCreate) {
        const { data } = await this.axiosClient.post<IResponseCreate<UserClient>>("/register", model);
        return data;
    }

}