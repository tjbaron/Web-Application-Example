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
	startExercise() {
		history.set('/kanji');
	}
	edit() {
		history.set('/edit');
	}
	render() {
		return (
			<article id="mainArticle">
				<div className="section">
					<div className="button right" onClick={this.edit}>Edit</div>
					<h1>{this.state.name}</h1>
					<p>{this.state.description}</p>
					<div className="button" onClick={this.startExercise}>Kanji Exercise</div>
				</div>
			</article>
		);
	}
}

export default Lesson;
