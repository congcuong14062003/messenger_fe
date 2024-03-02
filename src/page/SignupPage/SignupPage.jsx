import './SignupPage.scss';
import getDataForm from '../../utils/HandleForm/HandleForm';
import { Link, useNavigate } from 'react-router-dom';
function SignupPage() {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://messenger-be.vercel.app/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(getDataForm('.form'))
            });

            if (!response.ok) {
                throw new Error('Đã có lỗi xảy ra khi gửi yêu cầu.');
            } else {
                navigate("/login"); 
            }
        } catch (error) {
            console.log(error.message);
        }

    }

    return (
        <div className="bt-form-login-simple-1">
            <h1 className="form-heading">
                Welcome to ManhCuong Chat
            </h1>
            <p>Signup with:</p>
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
            <form className="form" onSubmit={(e) => handleSubmit(e)} autoComplete="off">
                <div className="form-group">
                    <label htmlFor="username">Username *</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        className="form-input"
                    />
                </div>
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
                <div className="form-group">
                    <label htmlFor="confirm_password">Confirm Password *</label>
                    <input
                        type="password"
                        name="confirm_password"
                        id="confirm_password"
                        placeholder="Confirm password"
                        className="form-input"
                    />
                </div>
                <button type="submit" className="form-btn">
                    Signup
                </button>
            </form>
            <div className="form-option">
                Have an account?
                <Link to="/login">Login now</Link>
            </div>
        </div>
    );
}

export default SignupPage;