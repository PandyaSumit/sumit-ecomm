import { useEffect } from "react"
import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../common/IconBtn"
import Img from './../../common/Img';

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <h1 className="mb-12 text-4xl font-semibold text-richblack-5 text-center sm:text-left">My Profile</h1>

      <div className="flex items-center justify-between bg-richblack-800 rounded-xl shadow-lg p-6 sm:p-12 mb-8">
        <div className="flex items-center gap-x-6">
          <Img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="w-[90px] h-[90px] rounded-full object-cover shadow-md"
          />
          <div className="space-y-2">
            <p className="text-xl font-semibold text-richblack-5 capitalize">{user?.firstName + " " + user?.lastName}</p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>

        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings")
          }}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      <div className="flex flex-col gap-y-12 mb-10">
        <div className="flex flex-col gap-y-6 rounded-xl bg-richblack-800 shadow-lg p-6 sm:p-12">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-richblack-5">About</p>
            <IconBtn
              text="Edit"
              onclick={() => {
                navigate("/dashboard/settings")
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
            >
              <RiEditBoxLine />
            </IconBtn>
          </div>

          <p
            className={`${user?.additionalDetails?.about
              ? "text-richblack-5"
              : "text-richblack-400"
              } text-sm font-medium leading-relaxed`}
          >
            {user?.additionalDetails?.about ?? "Write Something About Yourself"}
          </p>
        </div>

        <div className="flex flex-col gap-y-6 rounded-xl bg-richblack-800 shadow-lg p-6 sm:p-12">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-richblack-5">Personal Details</p>
            <IconBtn
              text="Edit"
              onclick={() => {
                navigate("/dashboard/settings")
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
            >
              <RiEditBoxLine />
            </IconBtn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="mb-2 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-semibold text-richblack-5 capitalize">{user?.firstName}</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-semibold text-richblack-5 capitalize">{user?.lastName}</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">Email</p>
              <p className="text-sm font-semibold text-richblack-5">{user?.email}</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
              <p className="text-sm font-semibold text-richblack-5">{user?.additionalDetails?.contactNumber ?? "Add Contact Number"}</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-semibold text-richblack-5">{user?.additionalDetails?.gender ?? "Add Gender"}</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
              <p className="text-sm font-semibold text-richblack-5">{formattedDate(user?.additionalDetails?.dateOfBirth) ?? "Add Date Of Birth"}</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">Account Type</p>
              <p className="text-sm font-semibold text-richblack-5">{user?.accountType}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
