## Spotify Clone Front-End

A front-end clone project of the Spotify web player. The project was created using the create-react-app CLI. The app is meant to work in conjunction with an authorization/authentication server.

## Description

The Spotify Clone Front-End is a web application built using create-react-app. It aims to replicate the UI and front-end behaviors of the official Spotify web player as closely as possible. The app consumes data from the Spotify API to provide users with access to playlists, albums, artists, and user profiles.

Non-authenticated users can browse and search for content but cannot control the player or access certain protected routes. If a non-authenticated user attempts to navigate to these routes, a tooltip will prompt them to log in.

Authenticated users with premium accounts (free accounts have limited functionality due to API limitations) can access additional routes for their own playlists, saved items, and use the app as a remote control player for any currently playing official Spotify player. It's important to note that direct streaming is not available through the Spotify API.
(NOTE- NO DIRECT STREAMING IS AVAILABLE THROUGH THE API)

To use the app, an authentication server is required. The app requires a refresh key stored in a cookie and an access key stored in memory. When these values are present, the user is considered "logged in," and the app will render the logged-in version with the user's personal information. This approach provides protection against cross-site request forgery (XSRF) by avoiding storing the access key in a cookie while keeping the user logged in even if they refresh the app.

## Custom Hooks and Utilities

One of the notable features of this project is the implementation of infinite scrolling on playlists and search results. This feature utilizes custom hooks and integrates with the Spotify API's pagination system.

The custom hooks, useInfiScroll and useTokenScroll, are similar and handle infinite scrolling for public and private (requires access token) data, respectively. These hooks utilize useState, useRef, useCallback, and the Intersection Observer API. The hooks accept a setList function from the parent component (used to set the paginated list internally) and return a useCallback ref that is passed to the last element of the list, as well as a setNext function to store the next paginated URI during the initial setup. Handling refs in functional components is achieved by using React.forwardRef on the child component.

Another interesting feature of the app is the live search functionality, where search results are updated in real-time as the user types into the search box. This is accomplished by making a new API request for each new letter entered.

##
To run the project, use the npm start command.