import React, { useState, useEffect } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { NavbarLinks } from "../../../data/navbar-links"
import studyNotionLogo from '../../assets/Logo/Logo-Full-Light.png'
import { fetchCourseCategories } from './../../services/operations/courseDetailsAPI';

import ProfileDropDown from '../core/Auth/ProfileDropDown'
import MobileProfileDropDown from '../core/Auth/MobileProfileDropDown'

import { AiOutlineShoppingCart } from "react-icons/ai"
import { MdKeyboardArrowDown } from "react-icons/md"




const Navbar = () => {
    // console.log("Printing base url: ", import.meta.env.VITE_APP_BASE_URL);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // console.log('USER data from Navbar (store) = ', user)
    const { totalItems } = useSelector((state) => state.cart)
    const location = useLocation();

    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchSublinks = async () => {
        try {
            setLoading(true)
            const res = await fetchCourseCategories();
            // const result = await apiConnector("GET", categories.CATEGORIES_API);
            // const result = await apiConnector('GET', 'http://localhost:4000/api/v1/course/showAllCategories');
            // console.log("Printing Sublinks result:", result);
            setSubLinks(res);
        }
        catch (error) {
            console.log("Could not fetch the category list = ", error);
        }
        setLoading(false)
    }

    // console.log('data of store  = ', useSelector((state)=> state))


    useEffect(() => {
        fetchSublinks();
    }, [])


    // when user click Navbar link then it will hold yellow color
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }


    // when user scroll down , we will hide navbar , and if suddenly scroll up , we will show navbar 
    const [showNavbar, setShowNavbar] = useState('top');
    const [lastScrollY, setLastScrollY] = useState(0);
    useEffect(() => {
        window.addEventListener('scroll', controlNavbar);

        return () => {
            window.removeEventListener('scroll', controlNavbar);
        }
    },)

    // control Navbar
    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY)
                setShowNavbar('hide')

            else setShowNavbar('show')
        }

        else setShowNavbar('top')

        setLastScrollY(window.scrollY);
    }



    return (
<nav
  className={`z-50 sticky top-0 w-full border-b border-richblack-700 text-white transition-all duration-300 ease-in-out ${
    showNavbar === "hide" ? "-translate-y-full" : "translate-y-0"
  } backdrop-blur-md bg-opacity-60 bg-richblack-900 shadow-md`}
>
  <div className="mx-auto flex w-11/12 max-w-maxContent items-center justify-between py-3">
    {/* LOGO */}
    <Link to="/">
      <img
        src={studyNotionLogo}
        alt="StudyNotion Logo"
        width={160}
        height={42}
        className="hover:opacity-90 transition-opacity duration-200"
      />
    </Link>

    {/* NAV LINKS */}
    <ul className="hidden sm:flex gap-x-6 text-sm font-medium">
      {NavbarLinks.map((link, index) => (
        <li key={index}>
          {link.title === "Catalog" ? (
            <div
              className={`group relative flex cursor-pointer items-center gap-1 px-3 py-1 rounded-xl transition-colors duration-200 ${
                matchRoute("/catalog/:catalogName")
                  ? "bg-yellow-25 text-black"
                  : "text-richblack-25 hover:bg-richblack-800"
              }`}
            >
              <p>{link.title}</p>
              <MdKeyboardArrowDown />
              {/* Dropdown */}
              <div className="invisible absolute left-1/2 top-full z-50 w-[280px] translate-x-[-50%] mt-3 flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-1">
                <div className="absolute left-[50%] top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-richblack-5" />
                {loading ? (
                  <p className="text-center text-sm text-richblack-400">Loading...</p>
                ) : subLinks?.length ? (
                  subLinks.map((subLink, i) => (
                    <Link
                      to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                      className="rounded-md px-4 py-2 text-sm hover:bg-richblack-50 transition-colors"
                      key={i}
                    >
                      {subLink.name}
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-sm">No Courses Found</p>
                )}
              </div>
            </div>
          ) : (
            <Link to={link?.path}>
              <p
                className={`px-3 py-1 rounded-xl transition-colors duration-200 ${
                  matchRoute(link?.path)
                    ? "bg-yellow-25 text-black"
                    : "text-richblack-25 hover:bg-richblack-800"
                }`}
              >
                {link.title}
              </p>
            </Link>
          )}
        </li>
      ))}
    </ul>

    {/* RIGHT SECTION */}
    <div className="flex items-center gap-3">
      {/* CART */}
      {user && user?.accountType !== "Instructor" && (
        <Link to="/dashboard/cart" className="relative">
          <AiOutlineShoppingCart className="text-3xl hover:bg-richblack-700 p-2 rounded-full transition-colors duration-200" />
          {totalItems > 0 && (
            <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-yellow-100 text-xs font-bold text-richblack-900">
              {totalItems}
            </span>
          )}
        </Link>
      )}

      {/* LOGIN / SIGNUP */}
      {token === null && (
        <>
          <Link to="/login">
            <button
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                matchRoute("/login")
                  ? "border-2 border-yellow-50 text-yellow-50"
                  : "border border-richblack-700 bg-richblack-800 text-richblack-100"
              }`}
            >
              Log In
            </button>
          </Link>
          <Link to="/signup">
            <button
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                matchRoute("/signup")
                  ? "border-2 border-yellow-50 text-yellow-50"
                  : "border border-richblack-700 bg-richblack-800 text-richblack-100"
              }`}
            >
              Sign Up
            </button>
          </Link>
        </>
      )}

      {/* PROFILE */}
      {token !== null && (
        <>
          <div className="hidden sm:block">
            <ProfileDropDown />
          </div>
          <div className="sm:hidden">
            <MobileProfileDropDown />
          </div>
        </>
      )}
    </div>
  </div>
</nav>

    )
}

export default Navbar
