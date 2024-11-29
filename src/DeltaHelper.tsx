interface DeltaOps {
	insert: string;
	attributes: {
		bold?: boolean;
		link?: string;
		header?: number;
	};
}

interface DeltaOp {
	insert: string | { image: string };
	attributes: {
		header: number;
	};
}

interface TempResultItem {
	type: string;
	content: string;
	closed: boolean;
}

const GetHtmlFromDeltaOpsString = (deltaOps: DeltaOps): string => {
	const input = deltaOps.insert.split('\n');

	let result = '';
	for (let i = 0; i < input.length; i++) {
		let current = input[i];
		if (deltaOps.attributes) {
			if (deltaOps.attributes.bold) {
				current = `<span class='bold-text'>${current}</span>`;
			}

			if (deltaOps.attributes.link) {
				current = `<a href="${deltaOps.attributes.link}">${current}</a>`;
			}
		}

		if (i !== input.length - 1) {
			result += `${current}</p><p>`;
		} else {
			if (current.length > 0) {
				result += current;
			} else {
				result = result.substring(0, result.length - '<p>'.length);
			}
		}
	}

	return result;
};

export const GetHtmlFromDelta = (delta: { ops: DeltaOp[] } | null): string => {
	if (!delta) {
		return '';
	}
	let tempResult: TempResultItem[] = [];
	let currentIndex = 0;

	for (let i = 0; i < delta.ops.length; i++) {
		let current = delta.ops[i];

		if (typeof current.insert === 'string') {
			// Обработка строк
			if (current.insert === '\n' && current.attributes?.header === 1) {
				// Логика для заголовка
				if (tempResult[currentIndex] && !tempResult[currentIndex].closed) {
					tempResult[
						currentIndex
					].content += `</${tempResult[currentIndex].type}>`;
					tempResult[currentIndex].closed = true;
					currentIndex++;
				}

				tempResult.push({
					type: 'div',
					content: "<div class='title'>",
					closed: true,
				});

				if (tempResult[currentIndex - 1]) {
					let lastArticleIndex =
						tempResult[currentIndex - 1].content.lastIndexOf('<p>');
					tempResult[currentIndex].content += tempResult[
						currentIndex - 1
					].content.substring(lastArticleIndex + '<p>'.length);
					tempResult[currentIndex].content += '</div>';
					tempResult[currentIndex - 1].content = tempResult[
						currentIndex - 1
					].content.substring(0, lastArticleIndex);
				}

				currentIndex++;
				continue;
			}

			if (tempResult[currentIndex] === undefined) {
				tempResult.push({
					type: 'p',
					content: '<p>',
					closed: false,
				});
			}

			// Преобразуем DeltaOp в DeltaOps
			const deltaOps: DeltaOps = {
				insert: current.insert,
				attributes: current.attributes,
			};

			tempResult[currentIndex].content += GetHtmlFromDeltaOpsString(deltaOps);

			if (tempResult[currentIndex].content.endsWith('</p>')) {
				tempResult[currentIndex].closed = true;
				currentIndex++;
			}
		} else {
			// Обработка изображений
			if (tempResult[currentIndex] && !tempResult[currentIndex].closed) {
				tempResult[
					currentIndex
				].content += `</${tempResult[currentIndex].type}>`;
				tempResult[currentIndex].closed = true;
				currentIndex++;
			}

			tempResult.push({
				type: 'img',
				content: `<img src="${(current.insert as { image: string }).image}" />`,
				closed: true,
			});

			currentIndex++;
		}
	}

	// Удаление пустых параграфов
	for (let i = 1; i < tempResult.length; i++) {
		if (
			tempResult[i].content.startsWith('<p></p>') &&
			tempResult[i - 1].type === 'img'
		) {
			tempResult[i].content = tempResult[i].content.replace('<p></p>', '');
		}
	}

	let result = tempResult
		.map(x => (x.closed ? x.content : ''))
		.join('')
		.replaceAll('<p></p>', '<br/>');
	return `<div class='content-block'>${result}</div>`;
};
