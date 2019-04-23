# with-http

> A React HTTP component.

[![NPM](https://img.shields.io/npm/v/with-http.svg)](https://www.npmjs.com/package/with-http) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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

## License

MIT © [gchumillas](https://github.com/gchumillas)
