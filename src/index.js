// @flow
import React from 'react'
import axios, { type $AxiosXHR } from 'axios'
import 'regenerator-runtime/runtime'

const HTTP_SUCCESS = { status: 200, statusText: '' }
const HTTP_SERVER_ERROR = { status: 500, statusText: 'Internal Server Error' }

export interface HttpClient {
  get<T>(url: string): Promise<$AxiosXHR<T>>;
  post<T>(url: string): Promise<$AxiosXHR<T>>;
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

    async get<T>(url: string, config?: {}): Promise<$AxiosXHR<T>> {
      this.setState({ isPending: true, ...HTTP_SUCCESS })
      try {
        return await axios.get(url, config)
      } catch (err) {
        const { status, statusText } = err.response || HTTP_SERVER_ERROR

        this.setState({ status, statusText })
        throw err
      } finally {
        this.setState({ isPending: false })
      }
    }

    async post<T>(url: string, data?: mixed, config?: {}): Promise<$AxiosXHR<T>> {
      this.setState({ isPending: true, ...HTTP_SUCCESS })
      try {
        return await axios.post(url, data, config)
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
