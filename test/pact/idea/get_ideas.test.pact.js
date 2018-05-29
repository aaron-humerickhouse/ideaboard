const Pact = require('@pact-foundation/pact');
const axios = require('axios');  // This is your client-side API layer
const term = Pact.Matchers.term
const like = Pact.Matchers.somethingLike
const eachLike = Pact.Matchers.eachLike

describe('Idea API', () => {
  let url = 'http://localhost:3001';

  const DATE_MATCHER = '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z'
  const INTERACTION_GET_IDEA_BODY = {
    "id": like(1),
    "title":like("A new cake recipe"),
    "body":like("Made of chocolate"),
    "created_at": term({matcher: DATE_MATCHER, generate: "2018-05-24T22:41:38.190Z"}),
    "updated_at":term({matcher: DATE_MATCHER, generate: "2018-05-24T22:41:38.190Z"})
  }

  const INTERACTION_GET_IDEAS_BODY = eachLike(INTERACTION_GET_IDEA_BODY)

  // const EXPECTED_GET_IDEAS_BODY = [
  //   {"id":4, "title":"Card game design", "body":"Like Uno but involves drinking", "created_at":"2018-05-24T22:41:38.195Z", "updated_at":"2018-05-24T22:41:38.195Z"},
  //   {"id":3, "title":"A novel set in Italy", "body":"A mafia crime drama starring Berlusconi", "created_at":"2018-05-24T22:41:38.194Z", "updated_at":"2018-05-24T22:41:38.194Z"},
  //   {"id":2, "title":"A twitter client idea", "body":"Only for replying to mentions and DMs", "created_at":"2018-05-24T22:41:38.192Z", "updated_at":"2018-05-24T22:41:38.192Z"},
  //   {"id":1, "title":"A new cake recipe", "body":"Made of chocolate", "created_at":"2018-05-24T22:41:38.190Z", "updated_at":"2018-05-24T22:41:38.190Z"}
  // ]

  // Copy this block once per interaction under test
  describe('GET'/* The API interaction being tested in words (string) */, () => {
    beforeEach(() => {
      const interaction = {
        state: 'i have a list of ideas',
        uponReceiving: 'GET ideas'/* Describe the request in words (string) */,
        withRequest: {
          method:  'GET'/* 'GET' or 'POST' or whatever (string) */,
          path:  '/api/v1/ideas.json'/* '/foo/bar' (string) */,
          query:  ''/* '?query=parameters' (string) */,
          headers: {
            Accept: 'application/json',
            charset: 'utf-8'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
            /* etc */
          },
          body: INTERACTION_GET_IDEAS_BODY/* describe the body (object using the Pact DSL)*/
        }
      };
      return provider.addInteraction(interaction);
    });

    // add expectations
    it('returns an array of idea objects'/* describe the test */, done => {
      axios.get(url + '/api/v1/ideas.json',  { headers: {"Accept": "application/json", "charset": "utf-8"}})
        .then(response => {
          expect(response.headers['content-type']).toEqual('application/json; charset=utf-8')
          // expect(response.data).toEqual(EXPECTED_GET_IDEAS_BODY)
          expect(response.status).toEqual(200)
          done()
          /* check the response here, using the default values provided to the Pact DSL */
        })
        .then(() => provider.verify());
      });
  });
});
