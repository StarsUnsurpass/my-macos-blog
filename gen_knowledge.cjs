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

// 直接保存为 JSON 文件，放在 public 目录下以便生产环境访问
fs.writeFileSync('public/knowledge.json', JSON.stringify(knowledgeData, null, 2));
console.log('Successfully generated public/knowledge.json');
