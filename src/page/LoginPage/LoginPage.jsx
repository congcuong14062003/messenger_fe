import '../SignupPage/SignupPage.scss';
import getDataForm from '../../utils/HandleForm/HandleForm';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import getToken from '../../utils/GetToken/GetToken';
function LoginPage() {
    const navigate = useNavigate();

    const handleAutoLogin = async () => {
        try {
            const accessToken = getToken(); // Sử dụng hàm getToken() để lấy accessToken từ cookies
            if (accessToken) {
                // Nếu có accessToken, tự động đăng nhập và chuyển hướng đến '/chat'
                const response = await fetch('https://messenger-be.vercel.app/auth/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${accessToken}` // Thêm accessToken vào tiêu đề Authorization
                    },
                    credentials: 'include'
                });
    
                if (!response.ok) {
                    throw new Error('Đã có lỗi xảy ra khi gửi yêu cầu.');
                } else {
                    navigate('/chat');
                }
            } else {
                // Nếu không có accessToken, chuyển hướng đến '/login'
                navigate('/login');
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://messenger-be.vercel.app/auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                credentials: 'include',
                body: JSON.stringify(getDataForm('.form'))
            });
    
            if (!response.ok) {
                throw new Error('Đã có lỗi xảy ra khi gửi yêu cầu.');
            } else {
                navigate('/chat');
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    
    // Gọi hàm handleAutoLogin khi component được render
    useEffect(() => {
        handleAutoLogin();
    }, []);
    
   
    return (
        <div className="bt-form-login-simple-1">
            <h1 className="form-heading">
                Welcome to ManhCuong Chat
            </h1>

            <p>Login with:</p>
            <span>

                <a href="#" className="btn-login-google">
                    <img width={30} src="https://i.pinimg.com/originals/74/65/f3/7465f30319191e2729668875e7a557f2.png" alt="" />

                </a>

                <a href="#" className=" btn-login-facebook">
                    <img width={30} src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/480px-Facebook_Logo_%282019%29.png" alt="" />

                </a>
            </span>
            <div className="text-wrap">
                <div className="text-line"></div>
                <p className="text">or</p>
                <div className="text-line"></div>
            </div>
            <form className="form" autoComplete="off" onSubmit={e => handleSubmit(e)}>
                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password *</label>
                    <input
                        type="password"
                        name="password_hash"
                        id="password"
                        placeholder="password"
                        className="form-input"
                    />
                </div>
                <div className="form-meta">
                    <div className="form-remember">
                        <input
                            type="checkbox"
                            name="remember-account"
                            id="remember-account"
                        />
                        <label htmlFor="remember-account">
                            Remember for 30 days
                        </label>
                    </div>
                    <a href="#" className="form-link">
                        Forgot Password
                    </a>
                </div>
                <button type="submit" className="form-btn">
                    Login
                </button>
            </form>
            <div className="form-option">
                Dont&#x27;t have am account?
                <Link to="/signup">Sign up for free</Link>
            </div>
        </div>
    );
}

export default LoginPage;