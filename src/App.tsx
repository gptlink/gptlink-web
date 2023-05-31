import { Routes, Route, Outlet, Link } from "react-router-dom";

const App = () =>  (
  <div>
    <h1>GPT Link web</h1>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="chat" element={<Chat />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  </div>
);

const Layout = () =>  (
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
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}


function Chat() {
  return (
    <div>
      <h2>Chat</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>404</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App
