# react-http-request

> A React HTTP component.

[![NPM](https://img.shields.io/npm/v/react-http-request.svg)](https://www.npmjs.com/package/react-http-request) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add react-http-request
```

## Usage

```jsx
import React, { Component } from 'react'

import withHttp from 'react-http-request'

class Example extends Component {
  render () {
    return (
      <MyComponent />
    )
  }
}

export default withHttp(Example)
```

## License

MIT © [gchumillas](https://github.com/gchumillas)
