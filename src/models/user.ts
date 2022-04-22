import { Irole } from './role'

export interface Iuser {
  id: number
  username: string
  pasword: string
  roleState: boolean
  default: boolean
  region: string
  roleId: number
  role: Irole
}
