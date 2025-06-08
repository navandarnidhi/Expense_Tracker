import { useContext } from "react";
import { CommonProps } from "./Navbar";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA } from "../../utils/data";

const SideMenu = ({ activeMenu }: CommonProps) => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("User Context does not exist");
  }

  const { user, clearUser } = userContext;

  const navigate = useNavigate();

  const handleClick = (route: string) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-50 md:w-64 md:pt-14 h-[100vh] bg-white border-r border-gray-200/50 fixed z-20 shadow-sm shadow-gray-200">
      {/* Add extra space below navbar and center the name */}
      <div className="mt-8 mb-6 flex items-center justify-center">
        {user?.fullName && (
          <span className="text-base md:text-lg font-semibold text-primary truncate max-w-[90%] text-center">
            {user.fullName}
          </span>
        )}
      </div>
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={index}
          className={`w-full flex items-center gap-3 md:gap-4 text-sm md:text-[16px]  ${
            activeMenu == item.label ? "text-white bg-primary" : ""
          } py-3 ps-6 rounded-tl-lg rounded-bl-lg my-1 md:my-2 `}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;