import React from 'react'
import { Outlet } from 'react-router-dom'
import {  Header } from '../components/global'


const Layout = () => {
  return (
    <main>
        <Header />
        <section>
            <Outlet />
        </section>
    </main>
  )
}

export default Layout