export interface EntuProp {
  _id?: string
  string?: string
  boolean?: boolean
  number?: number
  reference?: string
  datetime?: string
  filename?: string
  [key: string]: unknown
}

export interface EntuEntity {
  _id: string
  [key: string]: EntuProp[] | string
}

export interface EntuFetchResult {
  entities: EntuEntity[]
}
