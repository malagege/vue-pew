export interface Seat {
  row: number
  col: number
}

export interface Group {
  name: string
  color: string
  metas: Seat[]
}

export interface CellInfo {
  color: string
  index: number
  groupIndex: number
  groupName: string
}
