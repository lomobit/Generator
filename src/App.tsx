import React, { useRef, useState } from 'react';
import { GetHtmlFromDelta } from './DeltaHelper.tsx';
import Editor from './Editor.tsx';

import './App.css';

interface Tab {
	index: number;
	title: string;
	htmlContent: string;
}

interface JsonData {
	title: string;
	titlePhotoUrl: string;
	coordinates: string;
	region: string;
	tabs: Tab[];
	tags: string[];
}

const App = () => {
	const [contents, setContents] = useState([null, null, null]);
	const [activeTab, setActiveTab] = useState(0);
	const [title, setTitle] = useState('');
	const [coordinates, setCoordinates] = useState('');
	const [region, setRegion] = useState('');
	const [tags, setTags] = useState('');
	const [generatedText, setGeneratedText] = useState('');

	const quillRef = useRef<any>(null);

	const handleActiveTabChange = (index: number) => {
		const nextContents = contents.map((content, idx) => {
			if (idx === activeTab) {
				return quillRef.current.getContents();
			} else {
				return content;
			}
		});

		setContents(nextContents);
		setActiveTab(prevIndex => {
			quillRef.current.setContents(contents[index]);
			return index;
		});
		setContents(nextContents);
	};

	const getStyleForTabButton = (index: number) => {
		return {
			background: activeTab === index ? 'gray' : 'lightgray',
			color: activeTab === index ? 'white' : 'black',
			fontWeight: activeTab === index ? 'bold' : 'normal',
			height: '30px',
			marginRight: '2px',
			cursor: 'pointer',
		};
	};

	const handleGenerationClick = () => {
		const nextContents = contents.map((content, index) => {
			if (index === activeTab) {
				return quillRef.current.getContents();
			} else {
				return content;
			}
		});
		setContents(nextContents);
		const jsonData: JsonData = {
			title: title,
			titlePhotoUrl: '',
			coordinates: coordinates,
			region: region,
			tabs: [
				{
					index: 0,
					title: 'Описание',
					htmlContent: GetHtmlFromDelta(nextContents[0]),
				},
				{
					index: 1,
					title: 'Немного фактов',
					htmlContent: GetHtmlFromDelta(nextContents[1]),
				},
				{
					index: 2,
					title: 'Полезные советы',
					htmlContent: GetHtmlFromDelta(nextContents[2]),
				},
			],
			tags: tags
				.split(' ')
				.map(tag => tag.trim().replace(/^#/, ''))
				.filter(tag => tag !== ''),
		};

		setGeneratedText(JSON.stringify(jsonData, null, 2));
	};

	return (
		<div style={{ width: '1080px', marginLeft: 'auto', marginRight: 'auto' }}>
			<div>
				<h1>Вкладки</h1>
				<div>
					<p>Заголовок:</p>
					<input
						type='text'
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
				</div>
				<div>
					<p>Координаты:</p>
					<input
						type='text'
						value={coordinates}
						onChange={e => setCoordinates(e.target.value)}
					/>
				</div>
				<div>
					<p>Регион:</p>
					<input
						type='text'
						value={region}
						onChange={e => setRegion(e.target.value)}
					/>
				</div>
				<div>
					<p>Теги:</p>
					<input
						type='text'
						value={tags}
						onChange={e => setTags(e.target.value)}
					/>
				</div>
				<div style={{ marginTop: '20px', marginBottom: '5px' }}>
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
				<div style={{ width: '1080px' }}>
					<Editor value={contents[activeTab]} ref={quillRef} />
				</div>
			</div>
			<button
				onClick={handleGenerationClick}
				style={{
					marginTop: '20px',
					height: '40px',
					fontWeight: 'bold',
					cursor: 'pointer',
				}}
			>
				Сгенерировать JSON
			</button>
			<h1>JSONчик</h1>
			<div
				style={{
					border: '1px solid #ccc',
					padding: '10px',
					maxHeight: '300px',
					overflowY: 'auto',
					whiteSpace: 'pre-wrap',
				}}
			>
				<code>{generatedText}</code>
			</div>
		</div>
	);
};

export default App;
