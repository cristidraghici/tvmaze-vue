# TVmaze Vue 3 app

> An app to list tv shows using the TVmaze API

## Requirement

You will use an open TV shows API http://www.tvmaze.com/api to create an application that allows users to view a few lists (preferable horizontal list) of TV shows based on different genres (drama, comedy, sports, etc.).

Your goal is to display a few popular TV shows based on their rating and genre on a dashboard and when the user clicks on a TV show then the details of that TV show should be displayed on another screen. Also, the user should be able to search for a TV show to get the details. You can design your own UI which fits this requirement.

## Initial decisions

As we start the project, the following decisions will set the direction for the application. Since we are only at the beginning, this is merely a plan. If something will not work, will take too much time or will prove inefficient, it will be changed or removed and a motivation about it will be submitted.

- We will use vite + vue 3 + typescript because this seems to be the latest and greatest at the moment;
- We will create the project using `npm init vue@latest`and commit to`master` until we fix the initial bugs and remove the demo code;
- We will use `fetch` to make the requests to the TVmaze API, as they will all be GET requests. We will remember to implement mechanisms to prevent abusing the API;
- We will handle styling with Quasar, as it supports Vue 3 and vite;
- We will use `vue-router` to navigate between the dashboard, search (will be separate pages or two views inside the same page) and details views;
- We will use `pinia` to store the global state, which will be shared between the list pages and the details page;
- We will start by showing normal lists and at the end create a special component which will make horizontal lists.

## General ideas

- We will use git for versioning our code, but we will not have a remote (e.g. Github, Bitbucket etc.) setup from the beginning;
- In a real project, we would not commit anything to `master` except the initial boilerplate code. However, we will fix errors and make minimal changes, as we want to keep the number of branches to a minimum. For the same reason, we will only create only one feature branch;
- We will make imperative commits and try to be as concise as possible. Ideally, each commit in the feature branch will provide a solution to a clear requirement.

## Tasks

### master - Project setup

- The application as it was created by the `npm init vue@latest`;
- Some fixes were added for linting the code.

### T1 - Use fetch to make some requests to the TVmaze api

We will start with a cleanup, removing most of the existing components. We will then create a basic file structure which will mainly have a dashboard to make a request for a list of movies and a details page which will show the value of the passed param.

The next step will be to make some requests and get some data from TVmaze. Again, we are using `fetch` instead of `axios` because the requests are pretty simple and straightforward.

#### a fetch wrapper

We can create a wrapper for fetch which will return a `get` function already with a base configuration and some error handling. The wrapper can be in: `./src/api/http.ts` and have something like this for the content:

```javascript
const BASE_URL = 'https://api.tvmaze.com'
const BASE_CONFIG = {
  headers: {
    Accept: 'application/json'
  }
}

interface APIWrapperParams {
  baseUrl: string
  baseConfig: {
    [key: string]:
      | string
      | {
          [key: string]: string
        }
  }
}

interface GetParams {
  endpoint: string
  params?: {
    [key: string]: string
  }
}

/**
 * Wrapper to set the base configuration in the get requests
 */
const APIWrapper = ({ baseUrl, baseConfig }: APIWrapperParams) => {
  /**
   * Wrapper for the `get` request, the only one we use to access TVmaze's API
   */
  const get = async <T>({ endpoint, params }: GetParams): Promise<T> => {
    // ensure we prefix the endpoints
    if (endpoint.substring(0, 1) !== '/') {
      throw new Error('Endpoints should start with /')
    }

    // build the query param
    const url = params
      ? `${baseUrl}${endpoint}?${new URLSearchParams(params).toString()}`
      : `${baseUrl}${endpoint}`

    // make the get request
    const response = await fetch(url, { ...baseConfig, method: 'GET' })

    // throw if the response is not ok
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // return the content of the response
    return response.json() as Promise<T>
  }

  return { get }
}

/**
 * Create the get request from the wrapper with the basic configuration
 */
export default APIWrapper({
  baseUrl: BASE_URL,
  baseConfig: BASE_CONFIG
})
```

An example request will look like:

```javascript
import http from './http'
import type { Show } from './types'

export default async function getShows(page: number): Promise<Show[]> {
  const response = await http.get<Show[]>({
    endpoint: '/shows',
    params: {
      page: page as unknown as string
    }
  })

  return response
}
```

However, we will not take this approach as the requests we are doing are quite few, there isn't much redundant code to add for each request and we have some situations which are trickier to implement in the above example (e.g. having multiple params like `embed[]=`).

## Final notes

I have used Windows as a development environment after quite a long time. The OS should not make a big difference, of course. But from time to time, tools like the linter or even project bundlers themselves might have issues because of it.

---

If viewing the code with git in mind, please make sure to be on the `implement-requirements` branch. The name is not ideal, mainly because it's generic. But as mentioned above, we will use only one branch to implement multiple requirements/features/tasks.

More to be added :)
