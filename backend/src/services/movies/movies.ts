// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import crypto from 'crypto'


import {
  moviesDataValidator,
  moviesPatchValidator,
  moviesQueryValidator,
  moviesResolver,
  moviesExternalResolver,
  moviesDataResolver,
  moviesPatchResolver,
  moviesQueryResolver
} from './movies.schema'

import type { Application } from '../../declarations'
import { MoviesService, getOptions } from './movies.class'
import { moviesPath, moviesMethods } from './movies.shared'
import { HookContext } from '@feathersjs/feathers'
import { s3, bucketName, bucketEndpoint } from './utils/s3'
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { title } from 'process'

export * from './movies.class'
export * from './movies.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const movies = (app: Application) => {
  // Register our service on the Feathers application
  app.use(moviesPath, new MoviesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: moviesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(moviesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(moviesExternalResolver),
        schemaHooks.resolveResult(moviesResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(moviesQueryValidator), schemaHooks.resolveQuery(moviesQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(moviesDataValidator), schemaHooks.resolveData(moviesDataResolver)],
      patch: [schemaHooks.validateData(moviesPatchValidator), schemaHooks.resolveData(moviesPatchResolver), 
        async (context: HookContext) => {
          if(context.data.file) {
            const { data } = context
            
            const previousData = await context.service.get(context.id)
            const deleteParams = {
              Bucket: bucketName as string,
              Key: previousData.poster.split('/').pop()
            }
            const deleteCommand = new DeleteObjectCommand(deleteParams)
            await s3.send(deleteCommand)

            const uploadParams = {
              Bucket: bucketName as string,
              Key: `${crypto.randomBytes(32).toString('hex')}.${data.fileMetaData.name.split('.').pop()}`,
              Body: data.file,
              contentType: data.fileMetaData.type
            }
            const command = new PutObjectCommand(uploadParams)
            await s3.send(command)
            context.data = {
              title: data.title,
              year: data.year,
              poster: `${bucketEndpoint}/${uploadParams.Key}`
            }
          }
          return context
        }
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [moviesPath]: MoviesService
  }
}
