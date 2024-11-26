const GetHtmlFromDeltaOpsString = (deltaOps) => {
    let input = deltaOps.insert.split("\n");

    let result = "";
    for (let i = 0; i < input.length; i++) {
        let current = input[i];
        if (deltaOps.attributes !== undefined) {
            if (deltaOps.attributes.bold === true) {
                current = `<span class='bold-text'>${current}</span>`;
            }
            
            if (deltaOps.attributes.link !== undefined) {
                current = `<a href="${deltaOps.attributes.link}">${current}</a>`;
            }
        }

        if (i !== input.length - 1) {
            result += `${current}</p><p>`
        }
        else {
            result += current;
        }
    }
    
    if (result.endsWith("<p>")) {
        result = result.substring(0, result.length - 3);
    }

    return result.replaceAll("<p></p>", "<br/>");
}

export const GetHtmlFromDelta = (delta) => {
    let tempResult = [];
    let currentIndex = 0;


    for (let i = 0; i < delta.ops.length; i++) {
        let current = delta.ops[i];

        if (typeof current.insert === 'string') {
            if (current.insert === "\n" && current.attributes !== undefined && current.attributes.header === 1) {
                tempResult[currentIndex].closed = true;
                currentIndex++;

                tempResult.push({
                    type: "div",
                    content: "<div class=\"title\">",
                    closed: true
                });

                let lastArticleIndex = tempResult[currentIndex - 1].content.lastIndexOf("<p>");

                tempResult[currentIndex].content += tempResult[currentIndex - 1].content.substring(lastArticleIndex + "<p>".length);
                tempResult[currentIndex].content += "</div>";

                tempResult[currentIndex - 1].content = tempResult[currentIndex - 1].content.substring(0, lastArticleIndex);
                
                currentIndex++;
                continue;
            }
            
            if (current.insert === "\n") {
                let needContinue = false;
                if (tempResult[currentIndex] !== undefined) {
                    needContinue = tempResult[currentIndex].closed === false;

                    tempResult[currentIndex].closed = true;
                    tempResult[currentIndex].content += "</p>";
                    
                    currentIndex++;
                }

                if (needContinue) {
                    continue;
                }

                tempResult.push({
                    type: "br",
                    content: "<br/>",
                    closed: true
                });

                currentIndex++;

                continue;
            }
            if (tempResult[currentIndex] === undefined) {
                tempResult.push({
                    type: "p",
                    content: "<p>",
                    closed: false
                });
            }
            
            tempResult[currentIndex].content += GetHtmlFromDeltaOpsString(current);
            
            if (tempResult[currentIndex].content.endsWith("</p>")) {
                tempResult[currentIndex].closed = true;

                currentIndex++;
            }
        }
        else {
            if (tempResult[currentIndex] !== undefined && tempResult[currentIndex].type !== "img" && tempResult[currentIndex].closed === false) {
                tempResult[currentIndex].content += `</${tempResult[currentIndex].type}>`;
                tempResult[currentIndex].closed = true;
                
                currentIndex++;
            }

            tempResult.push({
                type: "img",
                content: `<img src="${current.insert.image}" />`,
                closed: true
            });

            currentIndex++;
        }
    }

    return `<div class='content-block'>${tempResult.map(x => x.content).join('')}</div>`;
}

