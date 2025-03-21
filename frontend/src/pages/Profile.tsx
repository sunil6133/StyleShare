import { useEffect, useState } from "react";
import { IPost, IUser } from "../types";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { tokenState, userState } from "../store/atoms/auth";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard";
import { GoUnverified, GoVerified } from "react-icons/go";
import { MdOutlineMailOutline } from "react-icons/md";
import { AiTwotoneInfoCircle } from "react-icons/ai";
import toast from "react-hot-toast";
import bgHero from "../assets/bgHero.png";
import { ProfileForm } from "../components/profileForm.tsx";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaGithubSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareParking } from "react-icons/fa6";
import { FeedbackForm } from "../components/FeedbackForm.tsx";
const Profile = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const token = useRecoilValue(tokenState);
  const currentUser = useRecoilValue(userState);
  const [clickUpdate, setClickUpdate] = useState(false);
  const [feedbackUpdate, setfeedbackUpdate] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/v1/user/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        setErrorMessage('Failed to fetch user details');
        setLoading(false);
      }
    };

    document.title = 'DevHub | View profile 👀';
    fetchUser();
  }, [token, posts]);

  const handleGenerateOtp = async () => {
    try {
      const response = await axios.post('/api/v1/user/generate-otp', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOtpSent(true);
      toast.success(response.data.message);
      setVerificationError("OTP sent to your mail");
    } catch (error: any) {
      toast.error('Failed to generate OTP');
      setVerificationError(error.response.data.error.message || 'Failed to generate OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.post('/api/v1/user/verify-otp', { otp: Number(otp) }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser((u) => {
        if (!u) return u;
        u.verified = true;
        return u;
      });
      setOtpSent(false);
      setOtp("");
      setVerificationError("");
      toast.success('OTP verified successfully');
    } catch (error: any) {
      toast.error('Failed to verify OTP');
      setVerificationError(error.response.data.error.message || 'Failed to generate OTP');
    }
  };

  const handleDelete = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  if (loading) {
    return <Loader />;
  }

  if (errorMessage) {
    return <div className='text-red-500 font-semibold text-lg text-center'>{errorMessage}</div>;
  }

  return (
    <>
      <div className="-mt-5 min-h-screen text-[#000435] bg-white dark:text-white dark:bg-[#000435]" style={{ backgroundImage: `url(${bgHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="w-full max-w-screen-xl mx-auto p-4 flex flex-col items-center text-[#000435] bg-white dark:text-white dark:bg-[#000435]" style={{ backgroundImage: `url(${bgHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="w-80 text-[#000435] bg-white dark:text-white dark:bg-[#000435] backdrop-blur-sm rounded-xl p-3 border border-sky-500">
            <div className="p-2 flex justify-end mr-2">
              {
                user?.verified ?
                  <button><GoVerified className="text-2xl text-[#000435] bg-white dark:text-white dark:bg-[#000435]" title="Verified" /></button>
                  :
                  <button><GoUnverified className="text-2xl text-[#000435] bg-white dark:text-white dark:bg-[#000435]" title="Unverified" /></button>
              }
            </div>
            <div className="flex flex-col items-center mb-3">
              <img className='h-20 w-20 rounded-full ring-2 ring-[#000435] dark:ring-white' src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=0ea5e9&color=fff&rounded=true&bold=true`} alt="profile-pic" />
              <p className="p-4 text-xl">{user?.username}</p>
              <p className="text-[#000435] font-semibold text-sm dark:text-white">{user?._count.following} followers</p>
              <p className="text-sky-400 flex items-center "><MdOutlineMailOutline className="text-xl" />
                <span className="ml-2 text-sm">{user?.email}</span>
              </p>
            </div>
            <div className="flex flex-row justify-center space-x-2 mb-3">
              {user?.twitter && <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform duration-300"><FaSquareXTwitter size={30} /></a>}
              {user?.github && <a href={user.github} target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform duration-300"><FaGithubSquare size={30} /></a>}
              {user?.linkedin && <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform duration-300"><FaLinkedin size={30} /></a>}
              {user?.portfolio && <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform duration-300"><FaSquareParking size={30} /></a>}
            </div>
            <div className="flex flex-row justify-center">  
            <div className="mb-2">
              <button type="button" onClick={() => { setClickUpdate(true) }} className="bg-red-500 py-2 mx-1 px-7 text-white font-semibold rounded-md text-sm hover:bg-red-600">
                Edit
              </button>
            </div>
            <div className="mb-2">
              <button type="button" onClick={() => { setfeedbackUpdate(true) }} className="bg-yellow-500 py-2 px-5 mx-1 text-white font-semibold rounded-md text-sm hover:bg-yellow-600">
                Rate Us
              </button>
            </div>
          </div>
          </div>
          {
            !user?.verified && (
              <div className="w-80 mt-6 bg-red-950 backdrop-blur-sm rounded-sm p-3 border border-dashed border-red-500">
                <div className="flex justify-between items-center">
                  <p className="font-sans text-sm text-white">Please verify your account</p>
                  <button className="bg-red-500 py-2 px-3 rounded-md text-sm hover:bg-red-600" onClick={handleGenerateOtp}>{otpSent ? "Resend OTP" : "Verify"}</button>
                </div>
                {
                  otpSent && (
                    <form method="post" action="#" className="flex justify-around items-center mt-5 mb-4" onSubmit={(e) => {
                      e.preventDefault()
                      handleVerifyOtp()
                    }}>
                      <input className="outline-none py-2 px-8 text-black text-md box-content" placeholder="Enter OTP" type="number" name="otp" id="otp" onChange={(e) => { setOtp(e.target.value) }} value={otp} min={100000} max={999999} required />
                      <button className="bg-blue-500 py-2 px-5 rounded-md text-xs hover:bg-blue-600">Verify OTP</button>
                    </form>
                  )
                }
                {
                  verificationError && (
                    <div className="py-2 text-sm text-red-300 flex justify-start flex-wrap items-center font-mono"><AiTwotoneInfoCircle className="text-red-500 text-lg me-2" />{verificationError}</div>
                  )
                }
              </div>
            )
          }
          {
            clickUpdate &&
              <ProfileForm user={user} dismiss={() => { setClickUpdate(false) }} open={clickUpdate} />
          }
          {
            feedbackUpdate &&
              <FeedbackForm user={user} dismiss={() => { setfeedbackUpdate(false) }} open={feedbackUpdate} />
          }
          <div className="mt-8 w-full">
            <h4 className="font-semibold">Posts ( {user?.posts.length} )</h4>
            <div className="mt-6 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {user?.posts.map(post => <PostCard key={post.id} post={post} onDelete={handleDelete} currentUser={currentUser} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
