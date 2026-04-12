const fs = require('fs');
const path = require('path');

function getTerminalData(dirPath, idPrefix) {
    if (!fs.existsSync(dirPath)) return [];
    const items = fs.readdirSync(dirPath);
    const results = [];
    for (const name of items) {
        const fullPath = path.join(dirPath, name);
        const stats = fs.statSync(fullPath);
        const id = (idPrefix + '-' + name).replace(/[^a-zA-Z0-9]/g, '-');
        
        if (stats.isDirectory()) {
            if (name === 'images' || name === '.git' || name === 'node_modules') continue;
            const children = getTerminalData(fullPath, id);
            if (children && children.length > 0) {
                results.push({ id, title: name, type: 'folder', children });
            }
        } else if (name.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            results.push({ id, title: name, type: 'file', content });
        }
    }
    return results;
}

const knowledgeData = {
    id: 'knowledge',
    title: 'knowledge',
    type: 'folder',
    children: getTerminalData('knowledge', 'knowledge')
};

// 直接保存为 JSON 文件，避免 JS 解析压力
fs.writeFileSync('src/configs/knowledge.json', JSON.stringify(knowledgeData, null, 2));
console.log('Successfully generated src/configs/knowledge.json');
