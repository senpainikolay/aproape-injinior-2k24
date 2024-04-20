import './App.css';
import {Routes, Route} from 'react-router-dom';
import {Home} from './pages/Home' 

import {AccountPage} from  "./pages/Account"
import {Accounts} from  "./pages/Accounts"
import { NoMatch } from './pages/NoMatch';
import { RequireNoAuth } from './components/Auth/RequireNoAuth';
import { RequireAuth } from './components/Auth/RequireAuth';



import { Layout } from './HOC/Layout';

import {SignUpPage} from "./pages/SignUp"
import {SignInPage} from "./pages/SignIn"



function App() {
  return (
    <Layout>

    <Routes>
       <Route element={<RequireNoAuth />}>     
           <Route path="/signup" element={<SignUpPage></SignUpPage>} />
            <Route path="/signin" element={<SignInPage></SignInPage>} />
       </Route>

       <Route element={<RequireAuth />}>
              <Route path="/" element={<Home></Home>} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/accounts/:id" element={<AccountPage />} />
        </Route>

         <Route path="*" element={<NoMatch></NoMatch>} />
    </Routes> 
    </Layout>

  );
}

export default App;
