import axios, { AxiosInstance, AxiosResponse } from 'axios';
import assert from 'assert';
import { ServerPlayer } from './Player';

/**
 * The format of a request to join a Town in Covey.Town, as dispatched by the server middleware
 */
export interface TownJoinRequest {
  /** userName of the player that would like to join * */
  userName: string;
  /** ID of the town that the player would like to join * */
  coveyTownID: string;
}

/**
 * The format of a response to join a Town in Covey.Town, as returned by the handler to the server
 * middleware
 */
export interface TownJoinResponse {
  /** Unique ID that represents this player * */
  coveyUserID: string;
  /** Secret token that this player should use to authenticate
   * in future requests to this service * */
  coveySessionToken: string;
  /** Secret token that this player should use to authenticate
   * in future requests to the video service * */
  providerVideoToken: string;
  /** List of players currently in this town * */
  currentPlayers: ServerPlayer[];
  /** Friendly name of this town * */
  friendlyName: string;
  /** Is this a private town? * */
  isPubliclyListed: boolean;
}

/**
 * Payload sent by client to create a Town in Covey.Town
 */
export interface TownCreateRequest {
  friendlyName: string;
  isPubliclyListed: boolean;
  creator: string;
}

/**
 * Response from the server for a Town create request
 */
export interface TownCreateResponse {
  coveyTownID: string;
  coveyTownPassword: string;
}

export interface UserCreateRequest {
  email: string;
}

export interface UserDeleteRequest {
  email: string;
}

export interface UpdateUserRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface UserInfoRequest {
  email: string;
}

export interface UserInfoResponse {
  email: string;
  firstName?: string;
  lastName?: string;
  currentAvatar: string;
}

/**
 * Response from the server for a Town list request
 */
export interface TownListResponse {
  towns: CoveyTownInfo[];
}

export interface SavedTownListResponse {
  towns: CoveySavedTownInfo[];
}

export interface SavedTownsRequest {
  email: string;
}

export interface SaveTownRequest {
  email: string;
  townID: string;
}

export interface DeleteTownRequest {
  email: string;
  townID: string;
}

/**
 * Payload sent by the client to delete a Town
 */
export interface TownDeleteRequest {
  coveyTownID: string;
  coveyTownPassword: string;
}

/**
 * Payload sent by the client to update a Town.
 * N.B., JavaScript is terrible, so:
 * if(!isPubliclyListed) -> evaluates to true if the value is false OR undefined, use ===
 */
export interface TownUpdateRequest {
  coveyTownID: string;
  coveyTownPassword: string;
  friendlyName?: string;
  isPubliclyListed?: boolean;
}

export interface CurrentAvatarRequest {
  email: string;
}

export interface UpdateAvatarRequest {
  email: string;
  avatar: string;
}

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
  isOK: boolean;
  message?: string;
  response?: T;
}

export type CoveyTownInfo = {
  friendlyName: string;
  coveyTownID: string;
  currentOccupancy: number;
  maximumOccupancy: number
};

export type CoveySavedTownInfo = {
  friendlyName: string;
  coveyTownID: string;
  publicStatus: string;
  currentOccupancy: number;
  maximumOccupancy: number
};

export default class TownsServiceClient {
  private _axios: AxiosInstance;

  /**
   * Construct a new Towns Service API client. Specify a serviceURL for testing, or otherwise
   * defaults to the URL at the environmental variable REACT_APP_ROOMS_SERVICE_URL
   * @param serviceURL
   */
  constructor(serviceURL?: string) {
    const baseURL = serviceURL || process.env.REACT_APP_TOWNS_SERVICE_URL;
    assert(baseURL);
    this._axios = axios.create({ baseURL });
  }

  static unwrapOrThrowError<T>(response: AxiosResponse<ResponseEnvelope<T>>, ignoreResponse = false): T {
    if (response.data.isOK) {
      if (ignoreResponse) {
        return {} as T;
      }
      assert(response.data.response);
      return response.data.response;
    }
    throw new Error(`Error processing request: ${response.data.message}`);
  }

  async logUser(requestData: UserCreateRequest): Promise<void> {
    const responseWrapper = await this._axios.post<ResponseEnvelope<void>>('/users', requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper, true);
  }

  async deleteUser(requestData: UserDeleteRequest): Promise<void> {
    const responseWrapper = await this._axios.delete<ResponseEnvelope<void>>(`/users/${requestData.email}`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper, true);
  }

  async updateUser(requestData: UpdateUserRequest): Promise<void> {
    const responseWrapper = await this._axios.patch<ResponseEnvelope<void>>(`/users/${requestData.email}`, requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper, true);
  }

  async getUserInfo(requestData: UserInfoRequest): Promise<UserInfoResponse> {
    const responseWrapper = await this._axios.get<ResponseEnvelope<UserInfoResponse>>(`/users/${requestData.email}`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async createTown(requestData: TownCreateRequest): Promise<TownCreateResponse> {
    const responseWrapper = await this._axios.post<ResponseEnvelope<TownCreateResponse>>('/towns', requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async updateTown(requestData: TownUpdateRequest): Promise<void> {
    const responseWrapper = await this._axios.patch<ResponseEnvelope<void>>(`/towns/${requestData.coveyTownID}`, requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper, true);
  }

  async deleteTown(requestData: TownDeleteRequest): Promise<void> {
    const responseWrapper = await this._axios.delete<ResponseEnvelope<void>>(`/towns/${requestData.coveyTownID}/${requestData.coveyTownPassword}`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper, true);
  }

  async listTowns(): Promise<TownListResponse> {
    const responseWrapper = await this._axios.get<ResponseEnvelope<TownListResponse>>('/towns');
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async listSavedTowns(requestData: SavedTownsRequest): Promise<SavedTownListResponse> {
    const responseWrapper = await this._axios.get<ResponseEnvelope<SavedTownListResponse>>(`/savedTowns/${requestData.email}`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async saveTown(requestData: SaveTownRequest): Promise<void> {
    const responseWrapper = await this._axios.post<ResponseEnvelope<void>>(`/savedTowns/${requestData.email}`, requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper, true);
  }

  async deleteSavedTown(requestData: DeleteTownRequest): Promise<void> {
    const responseWrapper = await this._axios.delete<ResponseEnvelope<void>>(`/savedTowns/${requestData.email}/${requestData.townID}`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper, true);
  }

  async joinTown(requestData: TownJoinRequest): Promise<TownJoinResponse> {
    const responseWrapper = await this._axios.post('/sessions', requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async getCurrentAvatar(requestData: CurrentAvatarRequest): Promise<string> {
    const responseWrapper = await this._axios.get(`/avatars/${requestData.email}`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async updateUserAvatar(requestData: UpdateAvatarRequest): Promise<void> {
    const responseWrapper = await this._axios.patch(`/avatars/${requestData.email}`, requestData);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper, true);
  }



}
