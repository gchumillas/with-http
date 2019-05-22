// @flow
import React from 'react'
import axios from 'axios'
import 'regenerator-runtime/runtime'

const HTTP_SUCCESS = { statusCode: 200, statusMessage: '' }
const HTTP_SERVER_ERROR = { statusCode: 500, statusMessage: 'Internal Server Error' }

export type XHR<Response> = {
    data: Response;
    headers?: Object;
    statusCode: number;
    statusMessage: string;
}

export interface HttpClient {
  +isPending: boolean;
  +isError: boolean;
  +statusCode: number;
  +statusMessage: string;
  request<Response>(config: {}): Promise<XHR<Response>>;
  get<Response>(url: string, config?: {}): Promise<XHR<Response>>;
  post<Response>(url: string, data?: mixed, config?: {}): Promise<XHR<Response>>;
  put<Response>(url: string, data?: mixed, config?: {}): Promise<XHR<Response>>;
  patch<Response>(url: string, data?: mixed, config?: {}): Promise<XHR<Response>>;
  delete<Response>(url: string, config?: {}): Promise<XHR<Response>>;
}

type DefaultProps = {
  http: HttpClient | void
}

export default function withHttp<Props: {}>(
  Component: React$ComponentType<Props>
): React$ComponentType<$Diff<Props, DefaultProps>> {
  return class extends React.Component<$Diff<Props, DefaultProps>, {
    isPending: boolean,
    isError: boolean,
    statusCode: number,
    statusMessage: string
  }> implements HttpClient {
    state = {
      isPending: false,
      isError: false,
      ...HTTP_SUCCESS
    }

    render= () => <Component http={this} {...this.props} />

    get isPending() {
      return this.state.isPending
    }

    get isError() {
      return this.state.isError
    }

    get statusCode() {
      return this.state.statusCode
    }

    get statusMessage() {
      return this.state.statusMessage
    }

    request<Response>(config: {}): Promise<XHR<Response>> {
      return this._send(axios, config)
    }

    get<Response>(url: string, config?: {}): Promise<XHR<Response>> {
      return this._send(axios.get, url, config)
    }

    post<Response>(url: string, data?: mixed, config?: {}): Promise<XHR<Response>> {
      return this._send(axios.post, url, data, config)
    }

    put<Response>(url: string, data?: mixed, config?: {}): Promise<XHR<Response>> {
      return this._send(axios.put, url, data, config)
    }

    patch<Response>(url: string, data?: mixed, config?: {}): Promise<XHR<Response>> {
      return this._send(axios.patch, url, data, config)
    }

    delete<Response>(url: string, config?: {}): Promise<XHR<Response>> {
      return this._send(axios.delete, url, config)
    }

    async _send(method: (...params: any) => any, ...params: any) {
      this.setState({ isPending: true, isError: false, ...HTTP_SUCCESS })
      try {
        return await method(...params)
      } catch (err) {
        const response = err.response
        const { status: statusCode, statusText: statusMessage } = response || HTTP_SERVER_ERROR

        this.setState({ isError: true, statusCode, statusMessage })
        throw response
      } finally {
        this.setState({ isPending: false })
      }
    }
  }
}
