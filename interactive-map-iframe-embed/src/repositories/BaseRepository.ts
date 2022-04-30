import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import IGet from "./interfaces/IGet";
import IGetOne from "./interfaces/IGetOne";
import IResponseGet from "./responses/IResponseGet";
import IResponseGetOne from "./responses/IResponseGetOne";
import IResponse from "./responses/IResponse";
import router from "@/router";

export default class BaseRepository<ClientModel> implements IGet<ClientModel>, IGetOne<ClientModel> {
    
    /**
     * The base url
     */
    protected baseURL : string;

    /**
     * 
     */
    public axiosClient : AxiosInstance;


    /**
     * Constructor
     */
    constructor (baseURL : string) {

        // Set base URL
        this.baseURL = baseURL;

        // Create an axios client
        this.axiosClient = axios.create({
            baseURL: `${process.env.VUE_APP_API_BASE_URL}/${this.baseURL}/`,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Access-Control-Max-Age': 1728000,
            },
            responseType: 'json',
            delayed: false,
        } as any);

        // Add delay for dev purposes
        this.axiosClient.interceptors.request.use((config : any) => {
            if (config.delayed) {
              return new Promise(resolve => setTimeout(() => resolve(config), 400));
            }
            return config;
        });

        // Error handling interceptor
        this.axiosClient.interceptors.response.use((response : AxiosResponse) : AxiosResponse<IResponse<any>> => {
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
        }, (err : AxiosError) : AxiosResponse<IResponse<any>> => {
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
                    router.push('/login/');
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