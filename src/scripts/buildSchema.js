#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const https = require('https')
const yargs = require('yargs')
const fetch = require('node-fetch')

const { parse, execute, buildSchema } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools')
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas')
const { printSchema, printIntrospectionSchema, buildClientSchema, introspectionQuery } = require('graphql/utilities')

// Make sure unhandled errors in async code are propagated correctly
process.on('uncaughtException', error => {
  console.error(error)
  process.exit(1)
})
process.on('unhandledRejection', error => {
  throw error
})

async function fetchRemoteSchema(url, insecure) {
  const agent = /^https:\/\//i.test(url) && insecure ? new https.Agent({ rejectUnauthorized: false }) : undefined
  const body = JSON.stringify({ query: introspectionQuery })
  const method = 'POST'
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }

  try {
    const response = await fetch(url, {
      agent,
      method,
      headers,
      body
    })
    const result = await response.json()

    if (result.errors) {
      throw new Error(`~~~Errors in introspection query result: ${result.errors}`)
    }
    if (!result.data) {
      throw new Error(`~~~No introspection query result data from: ${JSON.stringify(result)}`)
    }
    return buildClientSchema(result.data)
  } catch (e) {
    console.log(`~~~Failed to connect to server, No remote schema: ${e.message}`)
    return ''
  }
}

// Copy from graphql-js library, will be released in new version
// https://github.com/graphql/graphql-js/blob/master/src/utilities/introspectionFromSchema.js
async function introspectionFromSchema(schema /* GraphQLSchema */) {
  const queryAST = parse(introspectionQuery)
  const result = await execute(schema, queryAST)
  return result.data /* IntrospectionQuery */
}

async function introspectSchema(remoteURL, clientURL, output, insecure) {
  return fetchRemoteSchema(remoteURL, true)
    .then(schema => {
      const clientSchemas = fileLoader(clientURL)
      let typeDefs
      if (schema !== '') {
        const remoteSchema = printSchema(schema)
        typeDefs = mergeTypes([...clientSchemas, remoteSchema], {
          all: true
        })
      } else {
        typeDefs = mergeTypes([...clientSchemas], {
          all: true
        })
      }

      return makeExecutableSchema({
        typeDefs,
        resolverValidationOptions: {
          requireResolversForResolveType: false
        }
      })
    })
    .then(schema => {
      return introspectionFromSchema(schema)
    })
    .then(introspection => {
      const json = JSON.stringify(introspection, null, 2)
      fs.writeFileSync(output, json)
    })
    .catch(err => {
      console.error('Error while generating types for schema:', err)
    })
}

const remoteSchema = ''
const clientSchema = path.resolve('', 'src/**/*.graphql')
const output = path.resolve('', 'schemaDump.json')

// Generate an introspection JSON format from remote GraphQL server merging
// with any local GraphQL schemas
introspectSchema(remoteSchema, clientSchema, output, true)
