import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import Navigation from '../src/components/Navigation'
import LoginPage from './components/LoginPage/LoginPage'
import SignUpPage from './components/SignUpPage'
import Catalog from "./components/Catalog";
import Dashboard from "./components/Dashboard";

function Layout() {
  return (
    <>
      <Navigation/>
      <Outlet />
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
