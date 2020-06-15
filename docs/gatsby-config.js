module.exports = {
  siteMetadata: {
    title: `Structor documentation`,
    description: `Everything you need for starting with Questionnaires.`,
    author: `Helsenorge`,
  },
  pathPrefix: "/structor",
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-vscode`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-theme-docz`,
      options: {
        themeConfig: {
          mode: `light`,
        },
        ignore: ["README.md", "LICENSE.md"],
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-vscode",
            // OPTIONAL
            options: {},
          },
        ],
      },
    },

    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
