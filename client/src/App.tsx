import { useRoutes } from 'react-router-dom';
import routeConfig from './routes';
import Seo from './components/Seo/Seo';
import { makeSeoUrl } from './Constant';
import { Suspense } from 'react';
import Loading from './components/Common/Loading/Loading';

function App() {
  const routes = useRoutes(routeConfig);
  return <>
    <Seo
      title="Aapka Future | Smart Loan Management"
     description="Modern loan and finance management platform."
      url={makeSeoUrl()}
    />
       <Suspense fallback={<Loading/>}>
        {routes}
      </Suspense>
  
  </>
}


export default App;
