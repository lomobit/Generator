import Quill from 'quill';
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';

const toolbarOptions = [[{ header: 1 }, 'bold', 'link', 'image']];

interface EditorProps {
	readOnly: boolean;
	value: any;
	defaultValue: any;
	onTextChange: (delta: any, oldDelta: any, source: string) => void;
	onSelectionChange: (range: any, oldRange: any, source: string) => void;
}

const Editor = forwardRef<Quill, EditorProps>(
	({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
		const containerRef = useRef<HTMLDivElement | null>(null);
		const defaultValueRef = useRef<any>(defaultValue);
		const onTextChangeRef = useRef(onTextChange);
		const onSelectionChangeRef = useRef(onSelectionChange);

		useLayoutEffect(() => {
			onTextChangeRef.current = onTextChange;
			onSelectionChangeRef.current = onSelectionChange;
		});

		useEffect(() => {
			if (ref && 'current' in ref) {
				ref.current?.enable(!readOnly);
			}
		}, [ref, readOnly]);

		useEffect(() => {
			const container = containerRef.current;
			if (container) {
				const editorContainer = container.appendChild(
					container.ownerDocument.createElement('div')
				);
				const quill = new Quill(editorContainer, {
					theme: 'snow',
					modules: {
						toolbar: toolbarOptions,
					},
				});

				if (ref) {
					(ref as React.MutableRefObject<Quill | null>).current = quill;
				}

				if (defaultValueRef.current) {
					quill.setContents(defaultValueRef.current);
				}

				quill.on(Quill.events.TEXT_CHANGE, (...args) => {
					onTextChangeRef.current?.(...args);
				});

				quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
					onSelectionChangeRef.current?.(...args);
				});

				return () => {
					if (ref) {
						(ref as React.MutableRefObject<Quill | null>).current = null;
					}
					container.innerHTML = '';
				};
			}
		}, [ref]);

		return <div id='test_mark' ref={containerRef}></div>;
	}
);

Editor.displayName = 'Editor';

export default Editor;
