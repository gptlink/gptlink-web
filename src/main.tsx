import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import './locales';
import './styles/tailwind.less';
import router from './router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<RouterProvider router={router} />);
