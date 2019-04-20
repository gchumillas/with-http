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

import HttpRequest from 'react-http-request'

class App extends Component {
  handleSubmit = (http) => {
    console.log(http);
  }

  render () {
    const { classes } = this.props;

    return (
      <div>
        <HttpRequest>
        {({ http }) => {
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
                </TableBody>
              </Table>
            </div>
          )
        }}
        </HttpRequest>
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

export default withStyles(styles)(App)