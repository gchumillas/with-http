// @flow
import React from 'react'
import axios from 'axios'
import 'regenerator-runtime/runtime'

const HTTP_SUCCESS = { status: 200, statusText: '' }
const HTTP_SERVER_ERROR = { status: 500, statusText: 'Internal Server Error' }

export type XHR<Response> = {
    data: Response;
    headers?: Object;
    status: number;
    statusText: string;
}

export interface HttpClient {
  request<Response>(config: {}): Promise<XHR<Response>>;
  get<Response>(url: string, config?: {}): Promise<XHR<Response>>;
  post<Response>(url: string, data?: mixed, config?: {}): Promise<XHR<Response>>;
  put<Response>(url: string, data?: mixed, config?: {}): Promise<XHR<Response>>;
  patch<Response>(url: string, data?: mixed, config?: {}): Promise<XHR<Response>>;
  delete<Response>(url: string, config?: {}): Promise<XHR<Response>>;
}

type DefaultProps = {
  http: HttpClient | void,
  isPending: boolean | void,
  isError: boolean | void,
  status: number | void,
  statusText: string | void
}

export default function withHttp<Props: {}>(
  Component: React$ComponentType<Props>
): React$ComponentType<$Diff<Props, DefaultProps>> {
  return class extends React.Component<$Diff<Props, DefaultProps>, {
    isPending: boolean,
    isError: boolean,
    status: number,
    statusText: string
  }> implements HttpClient {
    state = {
      isPending: false,
      isError: false,
      ...HTTP_SUCCESS
    }

    render() {
      const { isPending, isError, status, statusText } = this.state

      return (
        <Component
          http={this}
          isPending={isPending}
          isError={isError}
          status={status}
          statusText={statusText}
          {...this.props} />
      )
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
        const { status, statusText } = response || HTTP_SERVER_ERROR

        this.setState({ isError: true, status, statusText })
        throw response
      } finally {
        this.setState({ isPending: false })
      }
    }
  }
}
