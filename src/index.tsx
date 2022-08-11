import React from 'react';
import ReactDOM from 'react-dom/client';

// Data, change the tree here
import { familyTree } from './data/family-tree.data';
import { familyTree2 } from './data/family-tree-2.data';
import { familyTree3 } from './data/family-tree-3.data';

// Components
import { Tree } from './components/Tree/Tree';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(
    <React.StrictMode>
        <Tree people={familyTree} />
    </React.StrictMode>,
);
