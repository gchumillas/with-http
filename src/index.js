// @flow
import React from 'react'
import axios, { type $AxiosXHR } from 'axios'

export interface HttpClient {
  get<T>(url: string): Promise<$AxiosXHR<T>>;
}

export default function withHttp<P>(Component: React$ComponentType<P>) {
  return class extends React.Component<P> implements HttpClient {
    request<T>(url: string, config?: {}): Promise<$AxiosXHR<T>> {
      return axios({
        url,
        ...config
      })
    }

    get<T>(url: string, config?: {}): Promise<$AxiosXHR<T>> {
      return this.request(url, config)
    }

    render() {
      return <Component http={this} {...this.props} />
    }
  }
}
