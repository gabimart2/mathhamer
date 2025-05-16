import {React} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { Header } from '../components/Header'
import { HomeView } from '../views/HomeView'

export const GlobalRouter = () => {

    const Layout = ({children}) => (
        <>
            <Header />
            {children}
        </>
    )

    return (
        <BrowserRouter>
            <Routes>
                <Route path='*' element={<Layout><HomeView/></Layout>}/>
            </Routes>
        </BrowserRouter>
    )

}