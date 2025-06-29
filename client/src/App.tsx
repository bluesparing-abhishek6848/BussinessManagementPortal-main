import { useRoutes } from 'react-router-dom';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import routeConfig from './routes';
import Seo from './components/Seo/Seo';
import { makeSeoUrl } from './Constant';
import { Suspense } from 'react';
import Loading from './components/Common/Loading/Loading';

function App() {
  const routes = useRoutes(routeConfig);
  return <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>

    <Seo
      title="Aapka Future | Smart Loan Management"
     description="Modern loan and finance management platform."
      url={makeSeoUrl()}
    />
       <Suspense fallback={<Loading/>}>
        {routes}
      </Suspense>
      </LocalizationProvider>

  </>
}


export default App;
