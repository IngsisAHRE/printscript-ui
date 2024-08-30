import {Pagination} from "./pagination.ts";

export type PaginatedUsers = Pagination & {
  users: User[]
}

export type User = {
  name: string,
  id: string
}

export type FriendUserDTO = {
  users: FriendDTO[],
  total: number,
}

export type FriendDTO = {
  user_id: string,
  nickname: string
}