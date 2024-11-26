import React, { useRef, useState } from 'react';
import Editor from './Editor';
import { GetHtmlFromDelta } from './DeltaHelper';

import './App.css';

const App = () => {
	const [contents, setContents] = useState([null, null, null]);
	const [activeTab, setActiveTab] = useState(0);

	// Use a ref to access the quill instance directly
	const quillRef = useRef();

	const saveActiveTabContentInState = () => {
		console.log(quillRef.current.getContents());
		console.log(quillRef.current.getText());
		console.log(quillRef.current.getFormat());

		const nextContents = contents.map((content, index) => {
			if (index === activeTab) {
				return quillRef.current.getContents();
			} else {
				return content;
			}
		});

		setContents(nextContents);
	}

	const handleActiveTabChange = (index) => {
		saveActiveTabContentInState();
		setActiveTab(prevIndex => {
			quillRef.current.setContents(contents[index]);
			return index;
		});
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

	const handleGenerationClick = () => {
		saveActiveTabContentInState();

		console.log(GetHtmlFromDelta(contents[activeTab]));
	}

	return (
		<div 
			style={{
				width: "1080px",
				marginLeft: "auto",
				marginRight: "auto",
			}}
		>
			<div>
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
					/>
				</div>
			</div>
			<button
				onClick={handleGenerationClick}
				style={{
					marginTop: "20px",
					height: "40px",
					fontWeight: "bold",
					cursor: "pointer",
				}}
			>
				Сгенерировать JSON
			</button>
		</div>
	);
};

export default App;