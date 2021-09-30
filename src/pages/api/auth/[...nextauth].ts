import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: "read:user",
    }),
  ],
  
  // Funções executadas de forma automática pelo NextAuth assim que acontece alguma ação
  callbacks: {
    async session(session) { // Executada sempre que uma sessão é verificada
      try {
        const userActiveSubsciption = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email),
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                'active',
              )
            ])
          )
        );

        return {
          ...session,
          activeSubscription: userActiveSubsciption,
        };
      } catch {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },

    async signIn(user, account, profile) {
      const { email } = user;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection("users"), 
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
        return true;
      } catch {
        return false;
      }
    },
  },
});
