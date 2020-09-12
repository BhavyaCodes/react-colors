import React, { Component } from 'react'

import Button from "@material-ui/core/Button"

import { ChromePicker } from 'react-color'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

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
		const {paletteIsFull} = this.props
		const { currentColor, newColorName} = this.state
		return (
			<div>
				<ChromePicker
					color={currentColor}
					onChangeComplete={(newColor)=> this.updateCurrentColor(newColor)}
				/>
				<ValidatorForm onSubmit={this.handleSubmit}>
					<TextValidator
						value={newColorName}
						name="newColorName"
						onChange={this.handleChange}
						validators={['required', 'isColorNameUnique','isColorUnique']}
						errorMessages={['this field is required', 'Color name must be unique','Color already used!']}
					/>
					<Button
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

export default ColorPickerForm
