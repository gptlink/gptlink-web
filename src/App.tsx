import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const App = () => {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <h1 className="text-3xl font-bold underline">GPT Link web</h1>

      {i18n.language === 'zh' && <button onClick={() => i18n.changeLanguage('en')}>{t('change to en')}</button>}
      {i18n.language === 'en' && <button onClick={() => i18n.changeLanguage('zh')}>{t('change to zh')}</button>}

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<Chat />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
};

const Layout = () => (
  <div>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/chat">Chat</Link>
        </li>
      </ul>
    </nav>
    <Outlet />
  </div>
);

function Home() {
  const { t } = useTranslation();
  return (
    <div className="p-10 bg-yellow-400">
      <h1>{t('welcome')}</h1>
    </div>
  );
}

function Chat() {
  return (
    <div className="p-10 bg-red-400">
      <h2>Chat</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div className="p-10 bg-red-400">
      <h2>404</h2>
      <p className="p-10 bg-green-400">
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App;
