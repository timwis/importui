import { JSONSchema7 } from 'json-schema'

interface Config {
  version: string
  title: string
  baseURL?: string
  url: string
  method: string
  schema: JSONSchema7
}

const config: Config = {
  version: '0.1.0',
  title: 'Import users',
  baseURL: 'https://enlf6yd1r00m.x.pipedream.net',
  url: '/users',
  method: 'post',
  schema: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Person',
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
        description: "The person's first name."
      },
      lastName: {
        type: 'string',
        description: "The person's last name."
      },
      age: {
        description: 'Age in years which must be equal to or greater than zero.',
        type: 'integer',
        minimum: 0
      }
    }
  }
}

export default config
