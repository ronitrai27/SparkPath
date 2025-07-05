import Image from "next/image";
import Link from "next/link";
import {
  //   LuX,
  LuPanelRightOpen,
  LuLayoutGrid,
  LuBookText,
  LuLayers,
  LuSettings,
  LuLogOut,
  LuSignal,
  LuCalendar1,
} from "react-icons/lu";
import { useAppContext } from "@/context/AppContext";
// import { logoutAction } from '@/app/login/actions';
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const { user } = useAppContext();
  //   const router = useRouter();

  //   const handleLogout = async () => {
  //     try {
  //       const res = await logoutAction();
  //       if (res.success) {
  //         localStorage.removeItem('auth-token');
  //         toast.success('Logged out successfully');
  //         router.push('/login');
  //         setCurrentUser(null);
  //       } else {
  //         toast.error(res.message || 'Logout failed');
  //       }
  //     } catch (err: any) {
  //       toast.error(err.response?.message || 'Logout failed');
  //     }
  //   };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 max-[650px]:w-56 bg-white text-black z-50 transform transition-transform duration-300 ease-in-out rounded-r-md border-r-2 border-rose-100 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4">
          <p className="text-black font-semibold font-sora text-2xl">
            Spark<span className="text-rose-500">Path</span>
          </p>
          <button onClick={toggleSidebar} aria-label="Close Sidebar">
            <LuPanelRightOpen
              size={24}
              className="text-rose-800 cursor-pointer"
            />
          </button>
        </div>
        <hr className="border-b-[0.2px] border-[#7B68DA]/30 w-[70%] mx-auto" />

        <ul className="flex flex-col items-start gap-6 min-[800px]:gap-5 px-3 min-[650px]:px-5 mt-3 py-4 ">
          <li>
            <Link
              href="/home"
              onClick={toggleSidebar}
              className="flex items-center gap-2 hover:text-rose-500 transition-colors font-sora text-base"
            >
              <LuLayoutGrid size={24} />
              Home
            </Link>
          </li>
          <li className="w-full">
            <Link
              href="/home/leaderboard"
              onClick={toggleSidebar}
              className="flex items-center justify-between pr-4 hover:text-rose-500 transition-colors font-sora text-base"
            >
              <div className="flex items-center gap-2">
                <LuLayers size={24} />
                Leaderboard
              </div>

              <Image
                src="/third.png"
                alt="Journal"
                width={24}
                height={24}
                className="ml-auto"
              />
            </Link>
          </li>
          <li>
            <Link
              href="/home"
              onClick={toggleSidebar}
              className="flex items-center gap-2 hover:text-rose-500 transition-colors font-sora text-base"
            >
              <LuBookText size={24} />
              Invite
            </Link>
          </li>
          <li className="w-full">
            <Link
              href="/home"
              onClick={toggleSidebar}
              className="flex items-center justify-between pr-4  hover:text-rose-500 transition-colors font-sora text-base w-full"
            >
              <div className="flex items-center gap-2">
                <LuSignal size={24} />
                Insights
              </div>
              <p className="font-sora px-2 py-1 rounded-lg bg-gradient-to-r from-indigo-400 to-pink-500 text-white text-xs ml-auto ">
                PRO
              </p>
            </Link>
          </li>
          <li>
            <Link
              href="/home"
              onClick={toggleSidebar}
              className="flex items-center gap-2 hover:text-rose-500 transition-colors font-sora text-base"
            >
              <LuCalendar1 size={24} />
              Calendar
            </Link>
          </li>
          <li className="w-full text-center mt-2">
            <p className="hover:text-[#7B68DA] transition-colors font-inter text-[16px]">
              History
            </p>

            <div className="w-full h-56 bg-gray-200 mt-3 rounded-xl overflow-y-auto scroll-smooth"></div>
          </li>

          <li className="mt-2">
            <Link
              href="/"
              className="flex items-center gap-2 hover:text-rose-500 transition-colors font-sora text-base"
            >
              <LuSettings size={24} />
              Settings
            </Link>
          </li>
          <li>
            <button
              //   onClick={handleLogout}
              className="flex items-center gap-2 hover:text-[#7B68DA] transition-colors font-sora text-base"
            >
              <LuLogOut size={24} />
              Logout
            </button>
          </li>
        </ul>
        {/* BOTTOM PART */}
        <div className="w-full bg-gradient-to-r from-rose-300 to-rose-500 py-2  mt-auto">
          <div className="flex items-center gap-4 px-2">
            <Image
              src="/man.png"
              alt="Avatar"
              width={45}
              height={45}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-white font-sora text-base">{user?.name}</p>
              <p className="text-white font-inter text-sm truncate max-w-32 min-[800px]:max-w-full">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
