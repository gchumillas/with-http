// @flow
import React from 'react'
import axios, { type $AxiosXHR } from 'axios'
import 'regenerator-runtime/runtime'

const HTTP_SUCCESS = { status: 200, statusText: '' }
const HTTP_SERVER_ERROR = { status: 500, statusText: 'Internal Server Error' }

export interface HttpClient {
  get<T>(url: string): Promise<$AxiosXHR<T>>;
}

export default function withHttp<P>(Component: React$ComponentType<P>) {
  return class extends React.Component<P, {
    isPending: boolean,
    status: number,
    statusText: string
  }> implements HttpClient {
    state = {
      isPending: false,
      ...HTTP_SUCCESS
    }

    // TODO: axios is not using the generic type 'T'
    request<T>(url: string, config?: {}): Promise<$AxiosXHR<T>> {
      return axios({
        url,
        ...config
      })
    }

    async get<T>(url: string, config?: {}): Promise<$AxiosXHR<T>> {
      this.setState({ isPending: true, ...HTTP_SUCCESS })
      try {
        return await this.request(url, config)
      } catch (err) {
        const { status, statusText } = err.response || HTTP_SERVER_ERROR

        this.setState({ status, statusText })
        throw err
      } finally {
        this.setState({ isPending: false })
      }
    }

    render() {
      const { isPending, status, statusText } = this.state

      return (
        <Component
          http={this}
          isPending={isPending}
          status={status}
          statusText={statusText}
          {...this.props} />
      )
    }
  }
}
