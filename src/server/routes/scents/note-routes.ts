import * as express from 'express'
import { checkLogin } from '../../middleware'
import { note, scent, brand } from '../../models'
import { convertToScentItem, promiseForBatch } from '../../routes'
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

      instance.model('Note', note)

      try {
        const existingNote = await instance.cypher('MATCH (note:Note {notename:{itemName}}) return note.notename', req.body)
        if (existingNote.records.length > 0) {
          return res.status(400).json({ error: 'Note must be unique.' })
        }

        Promise.all([
          instance.create('Note', {
            notename: req.body.itemName
          })
        ])
          .then(([note]) => {
            res.status(200).send(`Note ${note.properties().notename} created`)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
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

      instance.model('Note', note)
      const queries = promiseForBatch(instance, req.body)

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
    `${SCENT_DETAILS_PATH}/all`,
    async (req: express.Request, res: express.Response) => {

      instance.model('Note', note)
      const notes: ScentItem[] = []
      try {
        const result = await instance.cypher('MATCH (note:Note) RETURN note')
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
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching notes' })
      }
    }
  )

  app.post(
    `${SCENT_DETAILS_PATH}/allForScent`, checkLogin,
    async (req: express.Request, res: express.Response) => {
      instance.model('Note', note)
      instance.model('Scent', scent)
      instance.model('Brand', brand)
      const notes: ScentItem[] = []
      const params = { scentname: req.body.name, brandname: req.body.brand }
      try {
        await instance.cypher(`MATCH (scent:Scent {scentname:{scentname}})
        -[:BELONGS]->(brand:Brand {brandname:{brandname}})
        MATCH (note:Note)-[:BELONGS]->(scent)
        return scent, note`, params)
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
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching notes' })
      }
    }
  )

  app.post(
    `${SCENT_DETAILS_PATH}/addtoScent`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      instance.model('Scent', scent)
      instance.model('Brand', brand)
      instance.model('Note', note)

      try {
        const params = { scentname: req.body.name, brandname: req.body.brand, notename: req.body.note }
        const scentHasNoteAlready = await instance.cypher(`MATCH (scent:Scent {scentname:{scentname}})
        -[:BELONGS]->(brand:Brand {brandname:{brandname}})
        MATCH (note:Note {notename:{notename}})-[:BELONGS]->(scent)
        return scent, brand, note`, params)
        if (scentHasNoteAlready.records.length > 0) {
          console.log('EXISTING', scentHasNoteAlready.records)
          return res.status(400).json({ error: 'Scent already has this note.' })
        }
        await instance.cypher(`
        MATCH (scent:Scent {scentname:{scentname}})-[belbrand:BELONGS]->(brand:Brand {brandname:{brandname}})
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
