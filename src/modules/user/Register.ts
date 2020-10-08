import { Resolver,Query, Mutation, Arg, Authorized} from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/registerinput";
 
@Resolver()
export class registerResolver {
    
    @Authorized()
    //single query
    @Query( () => String)
        async hello() {
            return 'noo';
        }

    //mutation
    //in order to pass user as a type
    @Mutation( () => User )
    async register(
        @Arg("data") {firstname,lastname,email,password}: RegisterInput,
 
    ): Promise<User>{
        //creating hashed pass
        const hashedpassword = await bcrypt.hash(password,12);
 
        const user = new User()
        user.email = email
        user.firstname =firstname
        user.lastname =lastname
        user.password=hashedpassword
        user.save();
 
        return user;
    }
 
}

