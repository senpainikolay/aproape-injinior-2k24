import './App.css';
import {Routes, Route} from 'react-router-dom';
import {Home} from './pages/Home' 

import {AccountPage} from  "./pages/Account"
import {Accounts} from  "./pages/Accounts"
import { NoMatch } from './pages/NoMatch';

import { Layout } from './HOC/Layout';





function App() {
  return (
    <Layout>

    <Routes>
         <Route path="/" element={<Home></Home>} />

         <Route path="/accounts" element={<Accounts />} />
         <Route path="/accounts/:id" element={<AccountPage />} />



         <Route path="*" element={<NoMatch></NoMatch>} />
    </Routes> 
    </Layout>

  );
}

export default App;
