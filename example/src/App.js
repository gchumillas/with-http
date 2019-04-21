import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import IconButton from '@material-ui/core/IconButton'
import AddCircle from '@material-ui/icons/AddCircle'
import Save from '@material-ui/icons/Save'
import Delete from '@material-ui/icons/Delete'

import withHttp from 'react-http-request'

class App extends Component {
  state = {
    items: []
  }

  componentDidMount = () => {
    const { http } = this.props;

    http.get('http://localhost:3030/user').then(doc => {
      this.setState({ items: doc.data })
    })
  }

  handleSubmit = (http) => {
    console.log(http);
  }

  render () {
    const { classes, http } = this.props
    const { items } = this.state

    return (
      <div className={classes.container}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <TextField label="Enter full name" />
              </TableCell>
              <TableCell>
                <IconButton>
                  <AddCircle />
                </IconButton>
              </TableCell>
            </TableRow>
            {items.map((item, key) => {
              return (
                <TableRow key={key}>
                  <TableCell>
                    <TextField value={item.name} />
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <Save />
                    </IconButton>
                    <IconButton>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )})}
          </TableBody>
        </Table>
      </div>
    )
  }
}

const styles = theme => {
  return {
      container: {
        margin: '0 auto',
        maxWidth: 500
      }
  }
}

export default withHttp(withStyles(styles)(App))