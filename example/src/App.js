import React, { Component } from 'react'
import PropTypes from 'prop-types'
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

import { USERS_CONTROLLER } from './config'

class App extends Component {
  static propTypes = {
    http: PropTypes.object.isRequired,
    isPending: PropTypes.boolean,
    classes: PropTypes.object.isRequired
  }

  state = {
    fullname: '',
    items: []
  }

  componentDidMount = async () => {
    const { http } = this.props

    const doc = await http.get(USERS_CONTROLLER)
    this.setState({ items: doc.data })
  }

  handleFullnameChange = (event) => {
    const target = event.target
    const value = target.value

    this.setState({ fullname: value })
  }

  handleInputChange = key => (event) => {
    const target = event.target
    const value = target.value
    const items = [...this.state.items]

    items[key].name = value
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

  handleSave = key => async () => {
    const { http } = this.props
    const value = this.state.items[key].name

    await http.put(`${USERS_CONTROLLER}/${key}`, {
      name: value
    })

    const doc = await http.get(USERS_CONTROLLER)
    this.setState({ items: doc.data })
  }

  handleDelete = key => async () => {
    const { http } = this.props

    await http.delete(`${USERS_CONTROLLER}/${key}`)

    const doc = await http.get(USERS_CONTROLLER)
    this.setState({ items: doc.data })
  }

  render () {
    const { classes, isPending } = this.props
    const { fullname, items } = this.state

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
