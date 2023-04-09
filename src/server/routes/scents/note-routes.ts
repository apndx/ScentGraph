import * as express from 'express'
import * as neo4j from 'neo4j-driver'
import { checkLogin } from '../../middleware'
import { convertToScentItem, promiseForBatch } from '../../routes'
import { ScentItem } from '../../../common/data-classes'

export function configureNoteRoutes(
  app: express.Application,
  driver: neo4j.Driver,
  apiPath: string
): void {
  const SCENT_DETAILS_PATH = `${apiPath}/note`

  app.post(
    `${SCENT_DETAILS_PATH}/add`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()

      try {

        const existingNoteCypher = 'MATCH (note:Note {notename:$itemName}) return note.notename'
        const existingNote = await session.run(existingNoteCypher, { itemName: req.body.itemName })

        if (existingNote.records.length > 0) {
          return res.status(400).json({ error: 'Note must be unique.' })
        }

        Promise.all([
            session.run(`
            CREATE (note:Note {
              notename: $noteName,
              note_id: randomUuid()
            })
            SET note.created_at = datetime()
            RETURN note
            `,
            { noteName: req.body.itemName })
          ])
          .then(() => {
            res.status(200).send(`Note ${req.body.itemName} created`)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: `Something went wrong in creating a note, ${e}` })
      }
    }
  )

  app.post(
    `${SCENT_DETAILS_PATH}/addBatch`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()

      const queries = promiseForBatch(session, req.body)

      try {
        Promise.all(queries)
          .then(([notes]) => {
            console.log(`Notes added`)
            res.status(200).send(`Notes added`)
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: `Something went wrong in note batch creation, ${e}` })
      }
    }
  )

  app.get(
    `${SCENT_DETAILS_PATH}/all`,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()
      const notes: ScentItem[] = []
      try {
        const getNotesCypher = 'MATCH (note:Note) RETURN note'
        session.run(getNotesCypher)
          .then((result: any) => {
            result.records.map((row: any) => {
              notes.push(convertToScentItem(row.get('note')))
            })
            console.log(notes)
            res.status(200).send(notes)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching notes' })
      }
    }
  )

  app.post(
    `${SCENT_DETAILS_PATH}/allForScent`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()
      const notes: ScentItem[] = []
      const params = { scentname: req.body.name, brandname: req.body.brand }
      try {
          session.run(`
            MATCH (scent:Scent {scentname:$scentname})
            -[:BELONGS]->(brand:Brand {brandname:$brandname})
            MATCH (note:Note)-[:BELONGS]->(scent)
            return scent, note`,
            params)
          .then((result: any) => {
            result.records.map((row: any) => {
              notes.push(convertToScentItem(row.get('note')))
            })
            console.log(notes)
            res.status(200).send(notes)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching notes' })
      }
    }
  )

  app.post(
    `${SCENT_DETAILS_PATH}/addtoScent`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()

      try {
        const params = { scentname: req.body.name, brandname: req.body.brand, notename: req.body.note }

        const scentHasNoteCypher = `MATCH (scent:Scent {scentname:$scentname})
        -[:BELONGS]->(brand:Brand {brandname:$brandname})
        MATCH (note:Note {notename:$notename})-[:BELONGS]->(scent)
        return scent, brand, note`

        const scentHasNoteAlready = await session.run(scentHasNoteCypher, params)

        if (scentHasNoteAlready.records.length > 0) {
          console.log('EXISTING', scentHasNoteAlready.records)
          return res.status(400).json({ error: 'Scent already has this note.' })
        }
        session.run(`
        MATCH (scent:Scent {scentname:$scentname})-[belbrand:BELONGS]->(brand:Brand {brandname:$brandname})
        MATCH (note:Note{notename:$notename})
        MERGE (note)-[belongs:BELONGS]->(scent)-[has:HAS]->(note)
        RETURN type(belongs), type(has), scent, note`, params)
          .then(() => {
            console.log(`Note added to scent`)
            res.status(200).send(`Note added to scent`)
          })
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: `Something went wrong when adding note to a scent ${e}` })
      }
    }
  )

}
