import React, { Component } from 'react'
import {Link} from 'react-router-dom'

import MiniPalette from './MiniPalette'

export class PaletteList extends Component {
	render() {
		const {palettes} = this.props
		return (
			<div>
				<MiniPalette />
				<h1>React Colors</h1>
				{palettes.map(palette=>(
					<Link to={`/palette/${palette.id}`}>
						<h1>{palette.paletteName}</h1>
					</Link>
				))}
			</div>
		)
	}
}

export default PaletteList
