import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'
import pkg from 'jsonwebtoken';

const { verify, decode } = pkg;


const logger = createLogger('auth')

const jwksUrl = 'https://dev-p7lj87noc1cmlkju.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  logger.info('Authorizing a user', { authorization : event.authorizationToken });
  try {
    logger.error('User not authorized', { event: event})
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

   const jwks = await Axios.get(jwksUrl)
    const publicKey = jwks.data.keys.find(k=> k.kid == jwt.header.kid)['x5c'][0]
    logger.info('get publicKey successfully: ', publicKey)
    const cert = `-----BEGIN CERTIFICATE-----\n${publicKey}\n-----END CERTIFICATE-----`;
    const jwttoken = jsonwebtoken.verify(token, cert, { algorithms: ['RS256'] })
  return jwttoken;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
