// @flow
import React from 'react'
import axios, { type $AxiosXHR } from 'axios'
import 'regenerator-runtime/runtime'

const HTTP_SUCCESS = { status: 200, statusText: '' }
const HTTP_SERVER_ERROR = { status: 500, statusText: 'Internal Server Error' }

export interface HttpClient {
  request<T>(config: {}): Promise<$AxiosXHR<T>>;
  get<T>(url: string, config?: {}): Promise<$AxiosXHR<T>>;
  post<T>(url: string, data?: mixed, config?: {}): Promise<$AxiosXHR<T>>;
  put<T>(url: string, data?: mixed, config?: {}): Promise<$AxiosXHR<T>>;
  patch<T>(url: string, data?: mixed, config?: {}): Promise<$AxiosXHR<T>>;
  delete<T>(url: string, config?: {}): Promise<$AxiosXHR<T>>;
}

export default function withHttp<P>(Component: React$ComponentType<P>) {
  return class extends React.Component<P, {
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

    request<T>(config: {}): Promise<$AxiosXHR<T>> {
      return this._send(axios, config)
    }

    get<T>(url: string, config?: {}): Promise<$AxiosXHR<T>> {
      return this._send(axios.get, url, config)
    }

    post<T>(url: string, data?: mixed, config?: {}): Promise<$AxiosXHR<T>> {
      return this._send(axios.post, url, data, config)
    }

    put<T>(url: string, data?: mixed, config?: {}): Promise<$AxiosXHR<T>> {
      return this._send(axios.put, url, data, config)
    }

    patch<T>(url: string, data?: mixed, config?: {}): Promise<$AxiosXHR<T>> {
      return this._send(axios.patch, url, data, config)
    }

    delete<T>(url: string, config?: {}): Promise<$AxiosXHR<T>> {
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
