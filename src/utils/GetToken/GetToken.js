export default function getToken() {
    try {
      // Lấy token từ cookies
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
      
  
      if (tokenCookie) {
        const tokenValue = tokenCookie.split('=')[1].trim();
        const decodedToken = decodeURIComponent(tokenValue);
        return decodedToken;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error parsing token:', error.message);
      return null;
    }
  }
  