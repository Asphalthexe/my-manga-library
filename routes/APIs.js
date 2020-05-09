

//////////////////////////// API GOODREADS //////////////////////////////////////////////////////////////////////////////////

/* /////////////////////////// API Goodreads
const GoodreadsApi = require('');

// setting of the goodreads-api
const goodreadsApi = new GoodreadsApi({
  clientKey: process.env.GOODREADS_CLIENT_KEY,
  clientSecret: process.env.GOODREADS_CLIENT_SECRET
});

// Retrieve an access token
goodreadsApi
  .clientCredentialsGrant()
  .then(data => goodreadsApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

  
// GOODREADS Connection for login
var request = require("request");

var options = {
  method: 'POST',
  url: 'https://localhost:3000/api/v2/connections',
  headers: {authorization: 'Bearer YOUR_API_V2_TOKEN_HERE'}, //?
  body: {
    name: 'custom-goodreads',
    strategy: 'oauth1',
    enabled_clients: ['YOUR_ENABLED_CLIENT_ID'], //where to get?
    options: {
      client_id: 'YOUR_GOODREADS_KEY', //in env
      client_secret: 'YOUR_GOODREADS_SECRET', // in env
      requestTokenURL: 'http://www.goodreads.com/oauth/request_token',
      accessTokenURL: 'http://www.goodreads.com/oauth/access_token',
      userAuthorizationURL: 'http://www.goodreads.com/oauth/authorize',
      scripts: {
        fetchUserProfile: 'function(token, tokenSecret, ctx, cb) {var OAuth = new require("oauth").OAuth; var parser = require(\'xml2json\'); var oauth = new OAuth(ctx.requestTokenURL, ctx.accessTokenURL, ctx.client_id, ctx.client_secret, "1.0", null, "HMAC-SHA1"); oauth.get("https://www.goodreads.com/api/auth_user", token, tokenSecret, function(e, xml, r) { console.log(xml); if (e) return cb(e); if (r.statusCode !== 200) return cb(new Error("StatusCode: " + r.statusCode)); try { var jsonResp = JSON.parse(parser.toJson(xml)); var user = jsonResp.GoodreadsResponse.user; cb(null, user); } catch (e) { console.log(e); cb(new UnauthorizedError("[+] fetchUserProfile: Goodreads fetch script failed. Check Webtask logs")); } });}'
      }
    }
  },
  json: true
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

 */