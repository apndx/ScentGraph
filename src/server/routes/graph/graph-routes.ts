import * as express from "express"
import { checkLogin, authenticateToken } from '../../middleware'
import { scent, brand, timeOfDay, gender, season, category, user, note } from '../../models'
import {
  ScentToCreate,
  GraphNodeOut,
  GraphEdgeOut,
  GraphNodeIn,
  GraphEdgeIn,
  ScentItem
} from '../../../common/data-classes'
import {
  nodeConverter,
  edgeConverter,
  isUniqueNode,
  isUniqueEdge,
  cypherDecider,
  scentGraphParams,
  getScentNameAndBrand,
  scentGraphByNameParams
} from '../route-helpers'

export function configureGraphRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {

}