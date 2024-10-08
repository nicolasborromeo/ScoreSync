import { createBrowserRouter, Outlet, redirect, RouterProvider } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import * as sessionActions from './store/session'
import Navigation from '../src/components/Navigation'
import LoginPage from './components/LoginPage/LoginPage'
import SignUpPage from './components/SignUpPage'
import Catalog from "./components/Catalog";
import Dashboard from "./components/Dashboard";

function Layout() {

  const user = useSelector(state => state.session.user)
  if (!user) redirect('/')

  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch])


  return (
    <>
      <Navigation isLoaded={isLoaded}/>
      {isLoaded && <Outlet />}
      {/* <Outlet /> */}
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/catalog',
        element: <Catalog />
      },
      {
        path: '*',
        element: <h1>Page Not Found</h1>
      },
    ]
  }
])


function App() {
  return <RouterProvider router={router} />;
}

export default App;
