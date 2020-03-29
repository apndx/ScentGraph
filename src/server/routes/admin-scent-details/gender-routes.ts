import * as express from "express"

export function configureGenderRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const ADMIN_DETAILS_PATH = `${apiPath}/gender`

  app.post(
    `${ADMIN_DETAILS_PATH}/add`,
    async (req: express.Request, res: express.Response) => {

      instance.model("Gender", {
        gender_id: {
          type: "uuid",
          primary: true
        },
        gendername: {
          type: "string",
          index: true
        },
        has: {
          type: "relationship",
          relationship: "HAS",
          direction: "out",
          properties: {
            since: {
              type: "localdatetime",
              default: () => new Date()
            }
          }
        },
        belongs: {
          type: "relationship",
          relationship: "BELONGS",
          direction: "in",
          properties: {
            since: {
              type: "localdatetime",
              default: () => new Date()
            },
            width: {
              type: "number",
              default: 50
            }
          }
        },
        createdAt: {
          type: "datetime",
          default: () => new Date()
        }
      })

      try {
        Promise.all([
          instance.create("Gender", {
            gendername: req.body.gendername
          })
        ])
          .then(([gender]) => {
            console.log(`Gender ${gender.properties().gendername} created`)
            res.status(200).send(gender.properties())
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a gender' })
      }
    }
  )

  app.delete(
    `${ADMIN_DETAILS_PATH}/delete`,
    async (req: express.Request, res: express.Response) => {

      try {
        await instance.cypher('MATCH (gender:Gender {gendername:{gendername}}) DELETE gender', req.body)
          .then(() => {
            res.status(200).send('Gender deleted')
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a gender' })
      }
    }
  )
}
