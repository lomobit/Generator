import React, { useRef, useState } from 'react';
import Editor from './Editor';

import './App.css';

const App = () => {
	const [contents, setContents] = useState({
		0: '',
		1: '',
		2: ''
	});
	const [activeTab, setActiveTab] = useState(0);

	// Use a ref to access the quill instance directly
	const quillRef = useRef();

	const handleActiveTabChange = (index) => {
		console.log(index);

		setActiveTab(index);
	}

	const handleTextChange = (value) => {
		console.log(value);

		setContents(prev => ({
			...prev,
			[activeTab]: value
		}));
	}

	const getStyleForTabButton = (index) => {
		return {
			background: activeTab === index ? "gray" : "lightgray",
			color: activeTab === index ? "white" : "black",
			fontWeight: activeTab === index ? "bold" : "normal",
			height: "30px",
			marginRight: "2px",
			cursor: "pointer",
		}
	}

	return (
		<div 
			style={{
				width: "1080px",
				marginLeft: "auto",
				marginRight: "auto",
			}}
		>
			<h1>Вкладки</h1>
			<div style={{
				marginTop: "20px",
				marginBottom: "5px"
			}}>
				<button
					onClick={() => handleActiveTabChange(0)}
					style={getStyleForTabButton(0)}
				>
					Описание
				</button>
				<button
					onClick={() => handleActiveTabChange(1)}
					style={getStyleForTabButton(1)}
				>
					Немного фактов
				</button>
				<button
					onClick={() => handleActiveTabChange(2)}
					style={getStyleForTabButton(2)}
				>
					Полезные советы
				</button>
			</div>
			<div style={{
				width: "1080px"
			}}>
				<Editor
					value={contents[activeTab]}
					ref={quillRef}
					onTextChange={handleTextChange}
				/>
			</div>
		</div>
	);
};

export default App;