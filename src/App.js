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

	return (
		<>
			<h1>Вкладки</h1>
			<div style={{
				marginTop: "20px",
				marginBottom: "10px"
			}}>
				<button onClick={() => handleActiveTabChange(0)}>Описание</button>
				<button onClick={() => handleActiveTabChange(1)}>Немного фактов</button>
				<button onClick={() => handleActiveTabChange(2)}>Полезные советы</button>
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
		</>
	);
};

export default App;