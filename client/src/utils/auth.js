export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
  
    if (!token) return false;
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      const isExpired = payload.exp * 1000 < Date.now(); // Check expiration
      return !isExpired;
    } catch (error) {
      return false;
    }
  };
  