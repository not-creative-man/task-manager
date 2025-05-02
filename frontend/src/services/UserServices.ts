const API_URL = "http://localhost:3000";

class UserServices {
   async login(email: string, password: string) {
     const response = await fetch(API_URL + "/api/user/login?email=" + email + "&password=" + password);
     return await response.json();
   }

   async register(nickname: string, password: string, email: string) {
     const body = JSON.stringify({ nickname, password, email })
     const response = await fetch(API_URL + "/api/user/register", {
       method: "POST",
       headers: {
         'Content-Type': 'application/json' // Этот заголовок важен
       },
       body: body,
     })
     return await response.json();
   }
}

export default new UserServices();