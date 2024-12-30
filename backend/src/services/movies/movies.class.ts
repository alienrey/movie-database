// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import crypto from 'crypto'
import type { Application } from '../../declarations'
import type { Movies, MoviesData, MoviesPatch, MoviesQuery } from './movies.schema'
import dotenv from 'dotenv'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { s3, bucketName, bucketEndpoint } from './utils/s3'
dotenv.config()



export type { Movies, MoviesData, MoviesPatch, MoviesQuery }

export interface MoviesParams extends KnexAdapterParams<MoviesQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class MoviesService<ServiceParams extends Params = MoviesParams> extends KnexService<
  Movies,
  MoviesData,
  MoviesParams,
  MoviesPatch
> {
  async create(data: any, params?: ServiceParams): Promise<any> {
    const uploadParams = {
      Bucket: bucketName as string,
      Key: `${crypto.randomBytes(32).toString('hex')}.${data.fileMetaData.name.split('.').pop()}`,
      Body: data.file,
      contentType: data.fileMetaData.type
    }
    const command = new PutObjectCommand(uploadParams)
    await s3.send(command)

    return super.create(
      {
        title: data.title,
        year: data.year,
        poster: `${bucketEndpoint}/${uploadParams.Key}`,
      },
      params
    )
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'movies'
  }
}
