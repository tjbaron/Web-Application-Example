import React, { Component } from 'react';

class Button extends Component {
	constructor(props) {
		super();
		this.click = props.click;
		this.text = props.text;
	}
	render() {
		return (
			<div className="button right" onClick={this.click}>{this.text}</div>
		);
	}
}

export default Button;
