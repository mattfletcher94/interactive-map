import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import ICreate from "./interfaces/ICreate";
import IDelete from "./interfaces/IDelete";
import IGet from "./interfaces/IGet";
import IGetOne from "./interfaces/IGetOne";
import IUpdate from "./interfaces/IUpdate";
import IResponseCreate from "./responses/IResponseCreate";
import IResponseUpdate from "./responses/IResponseUpdate";
import IResponseGet from "./responses/IResponseGet";
import IResponseGetOne from "./responses/IResponseGetOne";
import IResponseDelete from "./responses/IResponseDelete";
import IResponse from "./responses/IResponse";
import router from "@/router";

export default class BaseRepository<ClientModel, CreateModel, UpdateModel> 
	implements 
		ICreate<CreateModel, ClientModel>, 
		IUpdate<UpdateModel, ClientModel>, 
		IDelete, IGet<ClientModel>, 
		IGetOne<ClientModel> 
	{
    
    /**
     * The base url
     */
    protected baseURL: string;

    /**
     * 
     */
    public axiosClient: AxiosInstance;


    /**
     * Constructor
     */
    constructor (baseURL: string) {

        // Set base URL
        this.baseURL = baseURL;

        // Create an axios client
        this.axiosClient = axios.create({
            baseURL: `${process.env.VUE_APP_API_BASE_URL}/${this.baseURL}/`,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': 'Bearer ' + window.localStorage.getItem('JWT'),
                'Access-Control-Max-Age': 1728000,
            },
            responseType: 'json',
            delayed: false,
        } as any);

        // Add delay for dev purposes
        this.axiosClient.interceptors.request.use((config: any) => {
            return config;
        });

        // Error handling interceptor
        this.axiosClient.interceptors.response.use((response: AxiosResponse): AxiosResponse<IResponse<any>> => {
            if (response.status === 200) {
                response.data = {
                    is200: response.data,
                }
            } else if (response.status === 201) {
                response.data = {
                    is201: response.data,
                }
            }
            return response;
        }, (err: AxiosError): AxiosResponse<IResponse<any>> => {
            if (err.response) {
                if (err.response.status === 400) {
                    err.response.data = {
                        is400: err.response.data,
                    }
                } else if (err.response.status === 401) {
                    err.response.data = {
                        is401: err.response.data,
                    }
                    window.localStorage.removeItem('JWT');
                    router.push('/login/').catch(failure => {});
                } else if (err.response.status === 404) {
                    err.response.data = {
                        is404: err.response.data,
                    }
                }
                return err.response;
            }
            throw err;
        });
    }

    /**
     * Create a new item
     * Possible responses: is201, is400
     */
    async create(model: CreateModel) {
        const { data } = await this.axiosClient.post<IResponseCreate<ClientModel>>("/", model);
        return data;
    }

    /**
     * Update an item
     * Possible responses: is200, is400, is404
     */
    async update(id: string, model: UpdateModel) {
        const { data } = await this.axiosClient.patch<IResponseUpdate<ClientModel>>("/" + id, model);
        return data;
    }

    /**
     * Delete an item
     * Possible responses: is201, is404
     */
    async delete(id: string): Promise<IResponseDelete> {
        const { data } = await this.axiosClient.delete<IResponseDelete>("/" + id);
        return data;
    }

    /**
     * Get all items
     * Possible responses: is200
     */
    async get() {
        const { data } = await this.axiosClient.get<IResponseGet<ClientModel>>("/");
        return data;
    }

    /**
     * Get one item
     * Possible responses: is200, is404
     * @param id 
     */
    async getOne(id: string) {
        const { data } = await this.axiosClient.get<IResponseGetOne<ClientModel>>("/" + id);
        return data;
    }

}