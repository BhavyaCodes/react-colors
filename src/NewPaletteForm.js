import React, { Component } from 'react'

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from "@material-ui/core/Button"

import { ChromePicker } from 'react-color'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {arrayMove} from 'react-sortable-hoc'

import DraggableColorList from './DraggableColorList'

const drawerWidth = 400;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    height: "calc(100vh - 64px)",
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});
export class NewPaletteForm extends Component {

  static defaultProps = {
    maxColors: 20
  }

  constructor(props){
    super(props)
    this.state={
      open: false,
      currentColor: "teal",
      newColorName: "",
      colors: this.props.palettes[0].colors,
      newPaletteName: ""
    }
  }
  componentDidMount() {
    ValidatorForm.addValidationRule('isColorNameUnique', (value) => {
      return this.state.colors.every(
        ({name}) => name.toLowerCase() !== value.toLowerCase()
      )
    });
    ValidatorForm.addValidationRule('isColorUnique', (value) => {
      return this.state.colors.every(
        ({color}) => color.toLowerCase() !== this.state.currentColor
      )
    });
    ValidatorForm.addValidationRule('isPaletteNameUnique', (value) => {
      return this.props.palettes.every(
        ({paletteName}) => paletteName.toLowerCase() !== value.toLowerCase()
      )
    });
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  updateCurrentColor = (newColor) => {
    this.setState({currentColor: newColor.hex})
  }

  addNewColor = () => {
    const newColor = {
      color: this.state.currentColor,
      name: this.state.newColorName
    }
    this.setState({colors: [...this.state.colors, newColor], newColorName: ""})
  }

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleSubmit = () => {
    let newName = this.state.newPaletteName
    const newPalette = {
      paletteName: newName,
      id: newName.toLowerCase().replace(/ /g, "-"),
      colors: this.state.colors,
      newPaletteName: ""
    }
    this.props.savePalette(newPalette)
    this.props.history.push('/')
  }

  removeColor = (colorName) => {
    this.setState({
      colors: this.state.colors.filter(color=> color.name !== colorName)
    })
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({colors}) => ({
      colors: arrayMove(colors, oldIndex, newIndex),
    }));
  };

  clearColors = () => {
    this.setState({colors: []})
  }

  addRandomColor = () => {
    const allColors = this.props.palettes.map(p => p.colors).flat()
    let rand = Math.floor(Math.random() * allColors.length)
    const randomColor = allColors[rand]
    this.setState({colors: [...this.state.colors, randomColor]})
  }

  render() {
    const { classes, maxColors } = this.props;
    const { open, colors } = this.state;
    const paletteIsFull = colors.length >= maxColors

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
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              Persistent drawer
            </Typography>
            <ValidatorForm onSubmit={this.handleSubmit}>
              <TextValidator 
                value={this.state.newPaletteName}
                label="Palette Name"
                name="newPaletteName"
                onChange={this.handleChange}
                validators={['required',"isPaletteNameUnique"]}
                errorMessages={['Enter a palette name','Name already taken']}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
              >Save Palette</Button>
            </ValidatorForm>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <Typography variant="h4">
            Design your palette
          </Typography>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.clearColors}
            >Clear Palette</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.addRandomColor}
              disabled={paletteIsFull}
            >Random Color</Button>
          </div>
          <ChromePicker
            color={this.state.currentColor}
            onChangeComplete={(newColor)=> this.updateCurrentColor(newColor)}
          />
          <ValidatorForm onSubmit={this.addNewColor}>
            <TextValidator
              value={this.state.newColorName}
              name="newColorName"
              onChange={this.handleChange}
              validators={['required', 'isColorNameUnique','isColorUnique']}
              errorMessages={['this field is required', 'Color name must be unique','Color already used!']}
            />
            <Button
              disabled={paletteIsFull}
              variant="contained"
              color="primary"
              style={{backgroundColor: paletteIsFull ? "grey" : this.state.currentColor }}
              type="submit"
            >
              {paletteIsFull ? "Palette Full": "Add Color"}
            </Button>
          </ValidatorForm>
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <DraggableColorList
            colors={this.state.colors}
            removeColor={this.removeColor}
            axis="xy"
            onSortEnd={this.onSortEnd}
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NewPaletteForm);
