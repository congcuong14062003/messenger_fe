import { jwtDecode } from 'jwt-decode'; // Chỉnh sửa import ở đây

function TokenInfo(token) {
  let decodedToken;

  try {
    decodedToken = jwtDecode(token);
    return decodedToken
  } catch (error) {
    console.error("Token can't be decoded", error);
  }
}

export default TokenInfo;
