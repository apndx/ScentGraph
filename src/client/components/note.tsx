import * as React from 'react'

export const Note = ({ note }) => (
  <div>
    <div className="details">
      {note.name}
    </div>
  </div>
)
