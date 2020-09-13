import React, { Component } from 'react'

import Button from "@material-ui/core/Button"

import { withStyles } from '@material-ui/core/styles';
import { ChromePicker } from 'react-color'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import styles from './styles/ColorPickerFormStyles'

export class ColorPickerForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			currentColor: "teal",
			newColorName: ""
		}
	}

	componentDidMount() {
    ValidatorForm.addValidationRule('isColorNameUnique', (value) => {
      return this.props.colors.every(
        ({name}) => name.toLowerCase() !== value.toLowerCase()
      )
    });
    ValidatorForm.addValidationRule('isColorUnique', (value) => {
      return this.props.colors.every(
        ({color}) => color.toLowerCase() !== this.state.currentColor
      )
    });
  }

	updateCurrentColor = (newColor) => {
    this.setState({currentColor: newColor.hex})
	}
	
	handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value
    })
	}
	
	handleSubmit = () => {
		const newColor = {
			color: this.state.currentColor,
			name: this.state.newColorName
		}
		this.props.addNewColor(newColor)
		this.setState({newColorName: ""})
	}

	render() {
		const {paletteIsFull, classes} = this.props
		const { currentColor, newColorName} = this.state
		return (
			<div>
				<ChromePicker
					color={currentColor}
					className={classes.picker}
					onChangeComplete={(newColor)=> this.updateCurrentColor(newColor)}
				/>
				<ValidatorForm onSubmit={this.handleSubmit}>
					<TextValidator
						margin="normal"
						placeholder="Color Name"
						variant="filled"
						className={classes.colorNameInput}
						value={newColorName}
						name="newColorName"
						onChange={this.handleChange}
						validators={['required', 'isColorNameUnique','isColorUnique']}
						errorMessages={['this field is required', 'Color name must be unique','Color already used!']}
					/>
					<Button
						className={classes.addColor}
						disabled={paletteIsFull}
						variant="contained"
						color="primary"
						style={{backgroundColor: paletteIsFull ? "grey" : currentColor }}
						type="submit"
					>
						{paletteIsFull ? "Palette Full": "Add Color"}
					</Button>
				</ValidatorForm>
			</div>
		)
	}
}

export default withStyles(styles)(ColorPickerForm)
