export interface IProject {
  id: number,
  name: string,
  web_url: string
}

export interface IProjectFilter {
  name: string | null
}

export interface IProjectDetails {
  release: string,
  tickets: ITicket[]
}

export interface ITicket {
  key: string,
  status: string
}
