// @flow
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import AddCircle from '@material-ui/icons/AddCircle'
import Save from '@material-ui/icons/Save'
import Delete from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import withHttp, { HttpClient } from 'with-http'

import { USERS_CONTROLLER } from './config'

class App extends Component<{
  classes: Object,
  http: HttpClient,
  isPending: boolean,
  isError: boolean,
  status: number,
  statusText: string
}, {
  isError: boolean,
  fullname: string,
  items: Array<{id: string, name: string}>
}> {
  state = {
    isError: false,
    fullname: '',
    items: []
  }

  errorMessages = {
    '404': 'Record not found'
  }

  componentDidMount = async () => {
    const { http } = this.props

    const doc = await http.get(USERS_CONTROLLER)
    this.setState({ items: doc.data })
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { isError } = this.props

    if (prevProps.isError !== isError) {
      this.setState({ isError })
    }
  }

  handleFullnameChange = (event) => {
    const target = event.target
    const value = target.value

    this.setState({ fullname: value })
  }

  handleInputChange = itemId => (event) => {
    const target = event.target
    const value = target.value
    const items = [...this.state.items]

    const item = items.find(item => item.id === itemId)
    if (item) {
      item.name = value
    }

    this.setState({ items })
  }

  handleAdd = async () => {
    const { http } = this.props
    const { fullname } = this.state

    await http.post(USERS_CONTROLLER, {
      name: fullname
    })

    const doc = await http.get(USERS_CONTROLLER)
    this.setState({ items: doc.data })

    this.setState({ fullname: '' })
  }

  handleSave = itemId => async () => {
    const { http } = this.props
    const { items } = this.state
    const item = items.find(item => item.id === itemId)
    const { name, id } = item || { name: '', id: -1 }

    await http.put(`${USERS_CONTROLLER}/${id}`, { name })

    const doc = await http.get(USERS_CONTROLLER)
    this.setState({ items: doc.data })
  }

  handleDelete = itemId => async () => {
    const { http } = this.props
    const { items } = this.state
    const item = items.find(item => item.id === itemId)

    if (item) {
      await http.delete(`${USERS_CONTROLLER}/${item.id}`)

      const doc = await http.get(USERS_CONTROLLER)
      this.setState({ items: doc.data })
    }
  }

  handleClose = () => {
    this.setState({ isError: false })
  }

  render () {
    const { classes, isPending, status, statusText } = this.props
    const { fullname, items, isError } = this.state
    const errorMsg = this.errorMessages[status] || statusText

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
                <TextField
                  label={'Full name'}
                  value={fullname}
                  onChange={this.handleFullnameChange} />
              </TableCell>
              <TableCell className={classes.lastColumn}>
                <IconButton disabled={isPending} onClick={this.handleAdd}>
                  <AddCircle />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <TextField value={'I\'M A FAKE ROW !!!'} />
              </TableCell>
              <TableCell className={classes.lastColumn}>
                <IconButton disabled={isPending} onClick={this.handleSave(-1)}>
                  <Save style={{ color: 'brown' }} />
                </IconButton>
                <IconButton disabled={isPending} onClick={this.handleDelete(-1)}>
                  <Delete style={{ color: 'brown' }} />
                </IconButton>
              </TableCell>
            </TableRow>
            {items.map((item, key) => {
              return (
                <TableRow key={key}>
                  <TableCell>
                    <TextField value={item.name} onChange={this.handleInputChange(item.id)} />
                  </TableCell>
                  <TableCell className={classes.lastColumn}>
                    <IconButton disabled={isPending} onClick={this.handleSave(item.id)}>
                      <Save />
                    </IconButton>
                    <IconButton disabled={isPending} onClick={this.handleDelete(item.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <Dialog open={isError} onClose={this.handleClose}>
            <DialogTitle>{`Error ${status}`}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {errorMsg}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} autoFocus>
                Accept
              </Button>
            </DialogActions>
          </Dialog>
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
    },
    lastColumn: {
      textAlign: 'right'
    }
  }
}

export default withHttp(withStyles(styles)(App))
