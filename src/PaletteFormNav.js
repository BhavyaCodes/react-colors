import React, { Component } from 'react'

import classNames from 'classnames';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from "@material-ui/core/Button"
import { withStyles } from '@material-ui/core/styles';

import {Link} from 'react-router-dom'

import PaletteMetaForm from './PaletteMetaForm'
import styles from './styles/PaletteFormNavStyles'

export class PaletteFormNav extends Component {
	constructor(props){
		super(props)
		this.state = {
			newPaletteName: "",
			formShowing: false
		}
	}

	handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value
    })
	}
	
	showForm = () => {
		this.setState({formShowing: true})
	}

	hideForm = () => {
		this.setState({formShowing: false})
	}

	render() {
		const { classes, open, palettes, handleSubmit } = this.props
		return (
			<div className={classes.root}>
				<CssBaseline />
				<AppBar
					position="fixed"
					color="default"
					className={classNames(classes.appBar, {
						[classes.appBarShift]: open,
					})}
				>
					<Toolbar disableGutters={!open}>
						<IconButton
							color="inherit"
							aria-label="Open drawer"
							onClick={this.props.handleDrawerOpen}
							className={classNames(classes.menuButton, open && classes.hide)}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" color="inherit" noWrap>
							Create a Palette
						</Typography>
					</Toolbar>
					<div className={classes.navBtns}>
						<Link to="/">
							<Button
								variant="contained"
								color="secondary"
								className={classes.button}
							>Go Back</Button>
						</Link>
						<Button
							variant="contained"
							color="primary"
							className={classes.button}
							onClick={this.showForm}
						>
							Save
						</Button>
					</div>
				</AppBar>
				{this.state.formShowing && (
					<PaletteMetaForm
						hideForm={this.hideForm}
						palettes={palettes}
						handleSubmit={handleSubmit}
				/>)}
			</div>
		)
	}
}

export default withStyles(styles, { withTheme: true })(PaletteFormNav);
