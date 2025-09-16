import { createBrowserRouter } from "react-router"
import RootLayout from "../../layouts/RootLayout/RootLayout"
import Home from "../../pages/Home/Home"
import AboutUs from "../../pages/AboutUs/AboutUs"
import Administration from "../../pages/Administration/Administration"
import Media from "../../pages/Media/Media"
import Committee from "../../pages/Commitee/Commitee"
import Gallary from "../../pages/Gallary/Gallary"
import Contact from "../../pages/Contact/Contact"
import PcAdmin from "../../pages/PcAdmin/PcAdmin"
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute"
import AddUpdate from "../../pages/PcAdmin/LastUpdateAdmin/AddUpdate/AddUpdate"
import EditUpdate from "../../pages/PcAdmin/LastUpdateAdmin/EditUpdate/EditUpdate"
import UpdateDetails from "../../pages/Home/LastUpdate/UpdateDetails/UpdateDetails"
import AllUpdates from "../../pages/Home/LastUpdate/AllUpdates/AllUpdates"
import AddImportantPerson from "../../pages/PcAdmin/ImportantPeopleAdmin/AddImportantPerson/AddImportantPerson"
import AddImportantLinks from "../../pages/PcAdmin/ImportantLinkAdmin/AddImportantLinks/AddImportantLinks"
import AddHistory from "../../pages/AboutUs/AddHistory/AddHistory"
import EditHistory from "../../pages/AboutUs/EditHistory/EditHistory"
import PrivacyPolicy from "../../components/PrivacyPolicy/PrivacyPolicy"
import TermsAndConditions from "../../components/Terms/Terms"

export const router = createBrowserRouter([
    {
        path: "/", 
        element: <RootLayout></RootLayout>,
        children: [
            {
                index: true,
                element: <Home></Home>
            },
            {
                path: "/about-us",
                element: <AboutUs></AboutUs>
            },
            {
                path: "/administration",
                element: <Administration></Administration>
            },
            {
                path: "/media",
                element: <Media></Media>
            },
            {
                path: "/committee",
                element: <Committee></Committee>
            },
            {
                path: "/gallery",
                element: <Gallary></Gallary>
            },
            {
                path: "/contact",
                element: <Contact></Contact>
            },
            {
                path: "/pc-admin",
                element: <ProtectedRoute><PcAdmin></PcAdmin></ProtectedRoute>
            },
            {
                path: "/add-update",
                element: <ProtectedRoute><AddUpdate></AddUpdate></ProtectedRoute>
            },
            {
                path: "/edit-update/:id",
                element: <ProtectedRoute><EditUpdate></EditUpdate></ProtectedRoute>
            },
            {
                path: "/update-details/:id",
                element: <UpdateDetails></UpdateDetails>
            },
            {
                path: "/all-updates",
                element: <AllUpdates></AllUpdates>
            },
            {
                path: "/add-important-person",
                element: <AddImportantPerson></AddImportantPerson>
            },
            {
                path: "/add-important-links",
                element: <ProtectedRoute><AddImportantLinks></AddImportantLinks></ProtectedRoute>
            },
            {
                path: "/add-history",
                element: <ProtectedRoute><AddHistory></AddHistory></ProtectedRoute>
            },
            {
                path: "/edit-history/:id",
                element: <ProtectedRoute><EditHistory></EditHistory></ProtectedRoute>
            },
            {
                path:"/privacy-policy",
                element: <PrivacyPolicy></PrivacyPolicy>
            },
            {
                path: "/terms-and-conditions",
                element: <TermsAndConditions></TermsAndConditions>
            }
        ]
    }
])