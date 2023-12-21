export interface ContentNote {
  active: string
  initialContent: string
  locked: boolean
  raw: boolean
}

export interface ContentProps {
  note: ContentNote
  onEdit: (active: string, content: string) => void
  indentOnTab: boolean
  tabSize: number
}
