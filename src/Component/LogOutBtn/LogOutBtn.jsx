
import { useNavigate } from 'react-router-dom';
import './LogOutBtn.scss';
import getToken from '../../utils/GetToken/GetToken';
function LogOutBtn() {
    const navigate = useNavigate();
    // xử lí đăng xuất
    const handleLogout = async() => {
        await fetch("https://messenger-be.vercel.app/auth/logout", {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + getToken(),
            },
            credentials: "include"
        });
        navigate("/login");
    }
    return (
        <i className="fa fa-sign-out" title='Log out' aria-hidden="true" onClick={handleLogout}></i>
    );
}

export default LogOutBtn;