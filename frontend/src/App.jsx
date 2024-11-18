import { createBrowserRouter, Outlet, useNavigate, RouterProvider } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import * as sessionActions from './store/session'
import Navigation from '../src/components/Navigation'
import LoginPage from './components/LoginPage/LoginPage'
import SignUpPage from './components/SignUpPage'
import Catalog from "./components/Catalog";
import Dashboard from "./components/Dashboard";
import Images from './components/Images'
import Card from "./components/Card";
import CardDetails from "./components/CardDetails"
import PublicCard from './components/PublicCard'
import InactiveCard from "./components/InactiveCard";
// import Footer from './components/Footer'

function Layout() {
  const navigate = useNavigate()
  const user = useSelector(state => state.session.user)


  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    })
  }, [dispatch])

  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/');
    }
  }, [isLoaded, user, navigate]);


  return (
    <div id="app-container">
      <Navigation isLoaded={isLoaded} />
      <div className="main">
        {isLoaded &&
          <div id="outlet-and-footer">
            <Outlet />
            {/* <Footer /> */}
          </div>
        }
      </div>
    </div>
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
    path: '/preview/:privateToken',
    element: <PublicCard preview={true} />,
  },
  {
    path: '/:privateToken',
    element: <PublicCard preview={false} />,
  },
  {
    path: '/inactive',
    element: <InactiveCard />,
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
        path: '/images',
        element: <Images />
      },
      {
        path: '/cards',
        element: <Card />
      },
      {
        path: 'cards/:cardId',
        element: <CardDetails />
      },
      {
        path: '*',
        element: <h1>Page Not Found</h1>
      },
    ]
  }
])


function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )

}


export default App;
