import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import IGet from "./interfaces/IGet";
import IGetOne from "./interfaces/IGetOne";
import IResponseGet from "./responses/IResponseGet";
import IResponseGetOne from "./responses/IResponseGetOne";
import IResponse from "./responses/IResponse";
import router from "@/router";
import ICheckAvailability from "@/models/PitchedModels/CheckAvailability";
import ICheckAvailabilityResult from "@/models/PitchedModels/CheckAvailabilityResult";

export default class PitchedRepository {
    
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
            baseURL: baseURL,
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
              return new Promise(resolve => setTimeout(() => resolve(config), 200));
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
                } else if (err.response.status === 404) {
                    err.response.data = {
                        is404: err.response.data,
                    }
                }
                return err.response;
            }
            if (err.message == "Network Error") {
                return {
                    data: {
                        isNetworkError: true,
                    }
                } as any;
            }
            throw err;
        });
    }


    /**
     * Get all items
     * Possible responses: is200
     */
    async checkAvailability(model: ICheckAvailability) {
        const { data } = await this.axiosClient.post<IResponseGet<ICheckAvailabilityResult>>("availability", model);
        return data;
    }


}