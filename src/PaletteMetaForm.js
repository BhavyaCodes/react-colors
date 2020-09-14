import React, { Component } from 'react'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {Picker} from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

export class PaletteMetaForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			stage: "form",
			newPaletteName: ""
		}
	}

	componentDidMount(){
		ValidatorForm.addValidationRule('isPaletteNameUnique', (value) => {
      return this.props.palettes.every(
        ({paletteName}) => paletteName.toLowerCase() !== value.toLowerCase()
      )
    });
	}

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
	};
	
	handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value
    })
	}
	
	showEmojiPicker = () => {
		this.setState({stage: "emoji"})
	}

	savePalette = (emoji) => {
		const newPalette = {
			paletteName: this.state.newPaletteName,
			emoji: emoji.native
		}
		this.props.handleSubmit(newPalette)
		this.setState({stage: ""})
	}

  render() {
		const { newPaletteName, stage } = this.state
		const { hideForm } = this.props
    return (
			<div>
				<Dialog
					open={stage === "emoji"}
					onClose={hideForm}
				>
					<DialogTitle id="form-dialog-title">Choose a Palette Emoji</DialogTitle>
					<Picker
						onSelect={this.savePalette}
						title="Pick a Palette Emoji"
					/>
				</Dialog>
        <Dialog
          open={stage === "form"}
          onClose={hideForm}
          aria-labelledby="form-dialog-title"
        >
					<DialogTitle id="form-dialog-title">Choose a Palette Name</DialogTitle>
					<ValidatorForm onSubmit={this.showEmojiPicker}>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your new beautiful palette. Make sure it's unique!
						</DialogContentText>						
							<TextValidator 
								value={newPaletteName}
								label="Palette Name"
								name="newPaletteName"
								fullWidth
								margin="normal"
								onChange={this.handleChange}
								validators={['required',"isPaletteNameUnique"]}
								errorMessages={['Enter a palette name','Name already taken']}
							/>
          </DialogContent>
          <DialogActions>
            <Button onClick={hideForm} color="primary">
              Cancel
            </Button>
						<Button
							variant="contained"
							color="primary"
							type="submit"
						>Save Palette</Button>
					</DialogActions>
				</ValidatorForm>
				</Dialog>
			</div>
    );
  }
}

export default PaletteMetaForm
