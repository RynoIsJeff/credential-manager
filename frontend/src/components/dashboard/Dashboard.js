import React, { useContext, useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import "../../styles/Dashboard.css"
import ApplicationContext from '../../state';
import axios from 'axios';


export default function Dashboard() {
    const { isLoggedIn, login } = useContext(ApplicationContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            if (localStorage.getItem("token")) {
                login()
            }
            else {

                navigate("/login");
            }
        }
    }, [isLoggedIn, login, navigate]);

    if (!isLoggedIn) {
        return <div>Login first</div>
    }

    return (
        <div className='default-layout'>
            <Sidebar />
            <div className='main-container'>
                <Outlet />
            </div>
        </div>
    )
}


function Sidebar() {
    const { logout } = useContext(ApplicationContext);
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch users
        axios.get('/api/users/profile', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(response => {
                setUserProfile(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });

    }, []);



    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate("/login");
    };

    const renderSidebarItems = () => {
        if (!userProfile) {
            return null;
        }

        const sidebarItems = [
            { path: "/", icon: "visibility", text: "Credential Repository" },

        ];
        if (userProfile.role === "management") {
            sidebarItems.push({ path: "/add-credential", icon: "add", text: "Add Credential" },)
        }

        if (userProfile.role === "admin") {
            sidebarItems.push(
                { path: "/add-credential", icon: "add", text: "Add Credential" },
                { path: "/assign-user-to-division", icon: "group_add", text: "Assign User to Division" },
                { path: "/de-assign-user-to-division", icon: "person_remove", text: "De-Assign User From Division" },
                { path: "/change-user-role", icon: "swap_horiz", text: "Change User Role" },
                { path: "/designate-user-from-ou", icon: "assignment_ind", text: "Assign User to OU" },
                { path: "/de-assign-user-from-ou", icon: "person_remove", text: "De-Assign User from OU" }
            );
        }

        return sidebarItems.map((item) => (
            <li key={item.path}>
                <NavLink to={item.path}>
                    <i className="material-icons medium">{item.icon}</i>
                    <span>{item.text}</span>
                </NavLink>
            </li>
        ));
    };

    return (
        <div className="sidebar">
            <h4>Credential Management</h4>
            <ul>
                {renderSidebarItems()}
                <li>
                    <a href="#logout" onClick={handleLogout}>
                        <i className="material-icons medium">logout</i>
                        <span>Logout</span>
                    </a>
                </li>
            </ul>
        </div>
    );
}