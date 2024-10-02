import { Injectable } from '@nestjs/common';
import { User } from './user/user';

@Injectable()
export class UserService {
   private users: User[] = [
       new User(1, "admin", "admin", [
         "admin",
         "user",
         "reader",
         "writer",
         "deleter",
       ]),
       new User(2, "user", "admin", [
         "user"
       ]),
       new User(2, "culture", "admin", [
        "culture"
      ]),
        new User(3, "reader", "admin", [
          "reader"
        ]),
        new User(4, "writer", "admin", [
          "writer"
        ]),
        new User(3, "reader_single", "admin", [
          "reader_single"
        ]),
        new User(3, "deleter", "admin", [
          "deleter"
        ]),
   ];

   async findOne(username: string): Promise<User | undefined> {
       return this.users.find(user => user.username === username);
   }
}
