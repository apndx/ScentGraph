import * as express from "express"
import { checkLogin } from '../../middleware'
import { note } from '../../models'
import { getName, promiseForBatch } from '../../routes'
import { ScentItem } from '../../../common/data-classes'

export function configureNoteRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const SCENT_DETAILS_PATH = `${apiPath}/note`

  app.post(
    `${SCENT_DETAILS_PATH}/add`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      instance.model("Note", note)

      try {
        const existingNote = await instance.cypher('MATCH (note:Note {notename:{itemName}}) return note.notename', req.body)
        if (existingNote.records.length > 0) {
          return res.status(400).json({ error: 'Note must be unique.' })
        }

        Promise.all([
          instance.create("Note", {
            notename: req.body.itemName
          })
        ])
          .then(([note]) => {
            console.log(`Brand ${note.properties().notename} created`)
            res.status(200).send(note.properties().notename)
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: `Something went wrong in creating a note, ${e}` })
      }
    }
  )

  app.post(
    `${SCENT_DETAILS_PATH}/addBatch`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      instance.model("Note", note)
      const queries =  promiseForBatch(instance, req.body)

      try {
        Promise.all(queries)
          .then(([notes]) => {
            console.log(`Notes added`)
            res.status(200).send(`Notes added`)
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: `Something went wrong in note batch creation, ${e}` })
      }
    }
  )

  app.get(
    `${SCENT_DETAILS_PATH}/all`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      instance.model('Note', note)
      const notes: ScentItem[] = []
      try {
        const result = await instance.cypher('MATCH (note:Note) RETURN note')
          .then((result: any) => {
            result.records.map((row: any) => {
              notes.push(getName(row.get('note')))
            })
            console.log(notes)
            res.status(200).send(notes)
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching notes' })
      }
    }
  )
}
