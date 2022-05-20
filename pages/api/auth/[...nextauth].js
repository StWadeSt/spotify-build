import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token){
    try{

        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
        console.log("Refresed Token is "+ refreshedToken);

        return{
            ...token,
            accessToken: refreshedToken.access_token,
            //This line = 1 hour as 3600 returns from spotify API
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
            //Replace if new token comes back else if defaults to the old token.
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        }

    }catch(error){
        console.error(error);

        return{
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
      signIn: '/login'
  },
  callbacks:{
      async jwt({token, account, user}){

          //initail sign in
          if (user && account) {
              return {
                  ...token, 
                  accessToken: account.access_token, 
                  refreshToken: account.refresh_token,
                  username: account.providerAccountId,
                  accessTokenExpires: account.expires_at * 1000, //we are handling the expiry +
                  //time in millisecondsa hence * 1000
              }
          }

          //Return the previous token if the access token has not expired yet 
          if (token && token.accessTokenExpires > Date.now()) {
            console.log("Existing Token is still valid")  
            return token;
          }

          //After Access Token has expired, we need to Refresh it
          console.log("Access Token has Expired")
          return await refreshAccessToken(token)
      },
      async session({ session, token}){
          session.user.accessToken = 
      }
  },
})