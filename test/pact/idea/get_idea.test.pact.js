const Pact = require('@pact-foundation/pact');
const axios = require('axios');  // This is your client-side API layer

describe('Idea API', () => {
  let url = 'http://localhost:3001';

  const EXPECTED_GET_IDEA_BODY = {"id":1, "title":"A new cake recipe", "body":"Made of chocolate", "created_at":"2018-05-24T22:41:38.190Z", "updated_at":"2018-05-24T22:41:38.190Z"}

  // Copy this block once per interaction under test
  describe('GET :id'/* The API interaction being tested in words (string) */, () => {
    beforeEach(() => {
      const interaction = {
        state: 'i have a single idea',
        uponReceiving: 'GET idea'/* Describe the request in words (string) */,
        withRequest: {
          method: 'GET'/* 'GET' or 'POST' or whatever (string) */,
          path:  '/api/v1/ideas/1.json'/* '/foo/bar' (string) */,
          query:  ''/* '?query=parameters' (string) */,
          headers: {
            Accept: 'application/json'
            /* etc */
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
            /* etc */
          },
          body: EXPECTED_GET_IDEA_BODY/* describe the body (object using the Pact DSL)*/
        }
      };
      return provider.addInteraction(interaction);
    });

    // add expectations
    it('returns single idea object with matching id'/* describe the test */, done => {
      axios.get(url + '/api/v1/ideas/1.json', { headers: {"Accept": "application/json"}})
        .then(response => {
          expect(response.headers['content-type']).toEqual('application/json')
          expect(response.data).toEqual(EXPECTED_GET_IDEA_BODY)
          expect(response.status).toEqual(200)
          done()
          /* check the response here, using the default values provided to the Pact DSL */
        })
        .then(() => provider.verify());
      });
  });
});
