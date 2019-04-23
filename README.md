# with-http

> An HTTP client for React to know the state of any HTTP request.

[![NPM](https://img.shields.io/npm/v/with-http.svg)](https://www.npmjs.com/package/with-http) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A [HOC](https://reactjs.org/docs/higher-order-components.html) component to know the status of any asynchronous HTTP request, from when it's emitted ( `isPending` ) until it's received ( `isError`, `status`, `statusText` ). This way we can update the interface according to the state of the request.

For example, we may want to disable some buttons while the request is pending. Or perhaps we want to display an modal dialog message if the request has failed.

The component injects the following properties:

  1. `http`: An HTTP client
  2. `isPending`: is the server's response pending?
  3. `isError`: has the request failed?
  4. `status`: HTTP status code
  5. `statusText`: HTTP status text

## Motivation

Traditionally, if we want to know the status of an asynchronous HTTP request, we can write something like this:

```JavaScript
this.setState({ isPending: true, isError: false })
try {
  const doc = await axios.get('http://some.url/path')
  this.setSate({ data: doc.data })
} catch (err) {
  const response = err.response
  const { status, statusText } = response
  this.setState( { isError: true, status, statusText })
} finally {
  this.setState({ isPending: false })
}
```

But the previous approach could become cumbersome if we have many requests in our code. And most of the time, when a request fails, we simply wat to show an error message to the user.

Thanks to this component we can get rid of the redundant code and simply write:

```JavaScript
const { http } = this.props
const doc = await http.get('http://some.url/path')
this.setSate({ data: doc.data })
```

## Install

```bash
yarn add with-http
```

## Usage

```jsx
import React from 'react'
import withHttp from 'with-http'

class Example extends React.Component {
  state = {
    username: '',
    password: ''
  }

  handleInputChange = name => event => {
    const target = event.target
    const value = target.value

    this.setState({ [name]: value })
  }

  handleSubmit = async () => {
    const { http } = this.props
    const { username, password } = this.state

    await http.post('http://www.myservice.com/login', { username, password })
  }

  render () {
    const { isPending, isError, status, statusText } = this.props
    const { username, password } = this.state

    return (
      <div>
        <input type='text'
          value={username} onChange={this.handleInputChange('username')} />
        <input type='password'
          value={password} onChange={this.handleInputChange('password')} />
        <input type='button'
          value='Login' disabled={isPending} onClick={this.handleSubmit} />
        <p hidden={!isError}>
          Error {status}: {statusText}
        </p>
      </div>
    )
  }
}

export default withHttp(Example)
```

See the `example` folder for a more detailed usage.

## License

MIT © [gchumillas](https://github.com/gchumillas)
