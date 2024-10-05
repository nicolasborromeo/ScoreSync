import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import Navigation from '../src/components/Navigation'
import LoginPage from '../src/components/LoginPage'

function Layout() {
  // const dispatch = useDispatch()
  // const [isLoaded, setIsLoaded] = useState(false);

  // useEffect(()=> {
  //   dispatch(sessionActions.restoreUser()).then(()=> {
  //     setIsLoaded(true)
  //   });
  // }, [dispatch])


  return (
    <>
      <Navigation/>
      {/* {isLoaded && <Outlet />} */}
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LoginPage />,
      },
      // {
      //   path: 'spots/:spotId',
      //   element: <SpotDetails />
      // },
      // {
      //   path: 'list',
      //   element: <CreateSpotPage />
      // },
      // {
      //   path: '/user/manage-spots',
      //   element: <ManageSpots />,
      // },
      // {
      //   path: '/user/manage-spots/:spotId',
      //   element: <UpdateSpotPage />
      // },
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
