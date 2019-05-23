# with-http

> An HTTP client for React to know the state of any HTTP request.

[![NPM](https://img.shields.io/npm/v/with-http.svg)](https://www.npmjs.com/package/with-http) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A [HOC](https://reactjs.org/docs/higher-order-components.html) component to know the status of any asynchronous HTTP request, from when it's emitted ( `isPending` ) until it's received ( `isError`, `statusCode`, `statusMessage` ). This way we can update the interface according to the state of the request.

For example, we may want to disable some buttons while the request is pending. Or perhaps we want to display an modal dialog message if the request has failed.

The component injects an `http` object, which contains the following properties and methods:

  1. `isPending`: checks if the server's response pending.
  2. `isError`: checks if the server responded with an HTTP error.
  3. `statusCode`: A number representing the HTTP status code.
  4. `statusMessage`: A string representing the HTTP status message
  5. `request(config)`: Sends a generic request.
  6. `get(url, config?)`: Sends a GET request.
  7. `put(url, data?, config?)`: Sends a POST request.
  8. `patch(url, data?, config?)`: Sends a PATCH request.
  9. `put(url, data?, config?)`: Sends a PUT request.
  10. `delete(url, config?)`: Sends a DELETE request.

The previous methods work in the same way as the axios methods does. Consult the [axios documentation](https://github.com/axios/axios) for more details.

## Motivation

Traditionally if we want to know the status of an asynchronous HTTP request, we can write something like this:

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

But the previous approach could become cumbersome if we have many requests in our code. And most of the time, when a request fails, we simply want to show an error message to the user.

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

If you want to use [@flow](https://flow.org/en/) simply copy the `src/index.js.flow` file to the `flow-typed` directory and rename it to something more descriptive, such as `with-http.js.flow`.

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
    const { http } = this.props
    const { username, password } = this.state

    return (
      <div>
        <input type='text'
          value={username} onChange={this.handleInputChange('username')} />
        <input type='password'
          value={password} onChange={this.handleInputChange('password')} />
        <input type='button'
          value='Login' disabled={http.isPending} onClick={this.handleSubmit} />
        <p hidden={!http.isError}>
          Error {http.statusCode}: {http.statusMessage}
        </p>
      </div>
    )
  }
}

export default withHttp(Example)
```

See the `example` folder for a more detailed usage.

## How to run the example

The example uses a [fake json-server](https://github.com/typicode/json-server) to display a list of users. Simply install and start the server before running the example:

```bash
# install json-server
yarn global add json-server

# start the fake json-server
cd example
yarn install
yarn start-server
```

Then open a new terminal and run the example:
```bash
cd example
yarn start
```

This library was created with the [create-react-library](https://www.npmjs.com/package/create-react-library) command line utility. Refer to the documentation for more information.

## License

MIT © [gchumillas](https://github.com/gchumillas)
