import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  userName: string;
  password: string;
}

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: 1,
      userName: 'admin',
      password: 'admin',
    },
    {
      id: 2,
      userName: 'admin2',
      password: 'admin222',
    },
    {
      id: 3,
      userName: 'admin3',
      password: 'admin333',
    },
  ];

  async findOneByUserName(userName: string): Promise<User | undefined> {
    return this.users.find((user) => user.userName === userName);
  }
}
