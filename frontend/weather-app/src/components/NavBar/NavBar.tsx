import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "@/redux/userSlice";
import { useRouter } from 'next/router';

const NavBar = () => {

    const user = useSelector((state: { user: { token: string } }) => state.user.token);
    const dispatch = useDispatch();
    const router = useRouter();

    const logoutSession = () => {
        dispatch(logout());
        localStorage.removeItem('token');
    };

    const goToLoginPage = () => {
        router.push("/login");
    }

    const goToRegisterPage = () => {
        router.push("/register");
    }

    return (
        <div className="navbar bg-white h-13 w-full text-white flex items-center justify-between">
            <Link href="/">
                <img src="logo.jpg" alt="logo" className="w-50 h-16" />
            </Link>
            <div className="mr-5">
                {user ? (
                    <button 
                        className="bg-red-500 px-6 py-1 rounded-xl hover:bg-red-700 duration-300 ease-in-out"
                        onClick={logoutSession}
                    >
                        Logout
                    </button>
                ) : (
                    <div className="space-x-3">
                        <button 
                            className="bg-green-500 px-6 py-1 rounded-xl hover:bg-green-700 duration-300 ease-in-out"
                            onClick={goToLoginPage}
                        >
                            Log In
                        </button>

                        <button 
                            className="bg-blue-500 px-6 py-1 rounded-xl hover:bg-blue-700 duration-300 ease-in-out"
                            onClick={goToRegisterPage}
                        >
                            Register
                        </button> 
                    </div>              
                )} 
            </div>
        </div>
    );
};

export default NavBar