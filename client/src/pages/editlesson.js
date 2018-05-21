import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from '../helpers/tfdom';
import cache from '../cache';
import history from '../history';
import './css/lesson.css';

var area; 

export function setup(path, a) {
	area = a;
	ReactDOM.render(
		<Lesson lesson={cache.lesson} />,
		area
	);
}

export function destroy() {
	ReactDOM.unmountComponentAtNode(area);
}

class Lesson extends Component {
	constructor(props) {
		super();
		this.state = props.lesson;
	}
	componentDidMount() {
		setTimeout(()=>{
			$.get('mainArticle').style.opacity = '1';
			$.get('mainArticle').style.marginTop = '0px';
		}, 200);
	}
	updateName(e) {
		this.setState({name: e.target.value});
	}
	updateDescription(e) {
		this.setState({description: e.target.value});
	}
	saveLesson() {
		cache.updateLesson(this.state);
		history.set('/');
	}
	render() {
		return (
			<article id="mainArticle">
				<div className="section">
					<input 
						value={this.state.name}
						onChange={this.updateName.bind(this)} />
					<textarea 
						onChange={this.updateDescription.bind(this)}
						defaultValue={this.state.description} >
					</textarea> 
					<div className="button" onClick={this.saveLesson.bind(this)}>Done</div>
				</div>
			</article>
		);
	}
}

export default Lesson;
