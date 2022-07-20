# Login With ZEBEDEE - Express Example App

The [ZEBEDEE](https://zebedee.io) App is a Bitcoin/Lightning gaming wallet focused on user experience. It interfaces with the ZEBEDEE Internal APIs to make charges/requests/payments/withdrawals. The App is available for iOS and Android.

You can provide your users `Login With ZEBEDEE` by signing up on our [Developer Dashboard](https://dashboard.zebedee.io), getting keys and [setting that up](https://documentation.zebedee.io/) into your app.

## Source code

This is a simple [Express](https://expressjs.com/) project with the authentication settings added on `app/authentication/init.js`.

### Setting your own OAuth2 keys

On order to try authenticating with ZEBEDEE, please go to the mentioned file, and replace the following lines accordingly:

```
  clientID: '<your_client_id>',           // Replace <your_client_id> with your actual client id
  clientSecret: '<your_client_secret>',   // Por testing purposes, the client secret is added here. On real case, it should be handled from back end for security reasons (refer to Docs)
  callbackURL: '<your_redirect_url',      // Set up your redirect Url
```

Once that's set, you are ready to test it.

## Development

Before starting make sure you have Node.js version **^16**.

- Install dependencies: `npm i`
- Start the project: `npm run start`

## Troubleshooting and Support

If you find issues when setting Oauth2 on your app, please reach out to support@zebedee.io. We will be happy to assist you further =)
