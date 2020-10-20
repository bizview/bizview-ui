/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-less`,
      options: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  ]
}
