import "reflect-metadata";
import Express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from 'type-graphql';
import { createConnection } from "typeorm";
import { registerResolver } from "./modules/user/register";
import connectRedis from "connect-redis";
import cors from "cors";
import session from 'express-session';
import { redis } from "./redis";
import { loginResolver } from "./modules/user/Login";
import { meResolver } from "./me";

//main logic
const main = async () => {

    // read from orm config file 
    await createConnection();

    //schema
    const schema = await buildSchema({
        resolvers: [meResolver,registerResolver,loginResolver],
        authChecker: ( { context:{req} } ) => {
          // here we can read the user from context
          // and check his permission in the db against the `roles` argument
          // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
        
          //is the user actually logged in or not
          console.log("session is "+req);
         if(req.session.userId){
            return true;
          }
          return false; // or false if access is denied
          
        }
    });

    const apolloserver = new ApolloServer({ 
        schema, 
        // req gives session data
        context: ({ req } :any) => ({req}) });

    const app = Express();

    
    //const SESSION_SECRET = process.env.SESSION_SECRET;
    const RedisStore = connectRedis(session); // connect node.req.session to redis backing store


    app.use(cors({
        credentials:true,
        origin: "http://localhost:3000"
    }));

    //login middleware before resolver middleware
    app.use(
        session({
          store: new RedisStore({
              //if error add 'as any' 
            client: redis as any
          }),
          //name of cookie
          name: "qid",
          //hard core string
          secret: "aslkdfjoiq12312",
          //prevet constantly adding session unless change smt
          resave: false,
          saveUninitialized: false,
          cookie: {
              //js can access
            httpOnly: true,
            //for prod
            secure: process.env.NODE_ENV === "production",
            //lasting age
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
          }
        })
      );
     apolloserver.applyMiddleware({app});
     app.listen(4000,() => console.log("Server working... "));
}

main();