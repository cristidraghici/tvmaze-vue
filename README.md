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

## Notes on the API itself

- This was not the most developer friendly API I have worked with. For example, it would have been nice to receive the same number of items on each request. Or it would have been nice to have some metadata which would minimally say if there are more items to be retrieved;
- The API does not seem to have querying based on Genre, so we will have to work something out to deliver that.

## Tasks

### master - Project setup

- The application as it was created by the `npm init vue@latest`;
- Some fixes were added for linting the code.

### T1 - Use fetch to make some requests to the TVmaze api

We will start with a cleanup, removing most of the existing components. We will then create a basic file structure which will mainly have a dashboard to make a request for a list of movies and a details page which will show the value of the passed param.

The next step will be to make some requests and get some data from TVmaze. Again, we are using `fetch` instead of `axios` because the requests are pretty simple and straightforward.

A possible improvement can be to cancel an ongoing request if navigating away from the page which is doing the request.

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

### T2 - Make a pretty interface

We will start by adding Quasar, for its support for Vue 3 and vite, but also for its ease of use. We will redesign the existing pages and try to provide some flow to the whole application.

However, the main focus of this project will not be on the looks, nor on showing as much information as possible. As long as the information comes and it's easy to access, then CSS and templating is something rather easy to do.

#### Debouncing

Apparently, inputs in quasar have their own debouncing solution for inputs we do not need our custom util anymore:

```javascript
export default function debounce<T>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout>

  return (event: Event) => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      if (typeof fn === 'function') {
        fn(event)
      }
    }, wait)
  }
}
```

An example call would be:

```javascript
const onSearchInputChange = debounce(async (e: Event) => {
  const target = e.target as HTMLInputElement
  search.value = target.value

  // ... or we can enjoy the reactivity and put the request on a watcher
  if (search.value.length > 0) {
    try {
      searchResults.value = await getSearchShows(search.value)
    } catch (e) {
      const err = e as Error
      console.error(err.message)
    }
  } else {
    searchResults.value = []
  }
}, 500)
```

### T3 - Structure the application

At this point we are able to access the API, but we are doing it in a rudimentary way and we show minimal data. It's time to start using pinia to manage our state.

The main reason to store the movie list outside the dashboard view is that we want the already loaded results available.

For a similar reason, we will create a separate store for the search. Since we want to keep the application small and simple, we will treat the search results as separate from those from the paginated results. As a new feature or an improvement, they could be put in the same store and then filtered out based on id.

We will not use a store for the show details requests, as we don't really need all that information elsewhere. However, in the show details page we will use the store to try to display the name of the show while loading.

To help with designing the pages, a delay to the API responses has been applied directly in the `@/api/` request files:

```javascript
// Delay the response by 1 second
await new Promise((resolve) => {
  setTimeout(() => {
    resolve('')
  }, 1000)
})
```

The above can also be slightly tweaked to check what happens when an error on the API occurs.

```javascript
const isSuccessful = (): boolean => Math.random() >= 0.5

await new Promise((resolve, reject) => {
  setTimeout(() => {
    isSuccessful() ? resolve('') : reject({ message: 'Error encountered! Beware!' })
  }, 1000)
})
```

We will also be organizing the views. Basically, each view will receive a cleanup and we will create sub-components where necessary. If the sub-components are common for multiple views, then they will be moved to the `./src/components` folder. As much as possible, the common components will be kept as dumb :) and isolated from the global state as possible.

A custom hook has been created to show notifications. Currently, we only need a notification to show errors. By using a hook wrapped around the notifications, we will ensure that the same type of notifications will look the same way everywhere in the app.

### T4 - Improve test coverage

At this point, the application is stable enough to tackle the testing aspect. We will improve on unit testing.

Testing with Quasar, vitest and typescript has proven more challenging than expected. Some minimal tests have been added, but this is a matter to be improved for sure.

### T5 - Implement the horizontal slider

As I am running out of time, the implementation for the horizontal slider will be mainly CSS based. A quick solution could be to implement a different way of showing the list in the `ShowsList.vue` component. However, this solution is not quite the clean one, so it will not make it in the codebase as it is. Things to improve: maybe use slots, find a better solution for the `itemWidth` value, find a better way to calculate the total width of the window.

#### Genres

With the horizontal slider we will also implement the genre lists.

### T6 - General cleanup and improvements

A first improvement to be done is to add some e2e tests to cypress. Since unit testing proved to be more complicated, the low hanging fruit provided by cypress will provide some safety related to the application's general functionality.

### T7 - Improvements to the provided solution

The solution delivered in the initially set amount of time has covered all the requirements, but some of them in a very basic manner. One which needed big improvements was the horizontal shows carousel. For that, I have decided to only set the height and width of the poster in a configuration file, not use slots for now and try to reuse as much of the existing codebase as possible.

The new component will receive the list with all the available and matching shows (we have filtering by genre) and will manage pagination on its own. This provides for an easy solution, which can be improved upon if needed.

The ShowsList component has also received some cleanup: more default props, customizable load more text and an animation for the posters displayed.

For a better code structure, the listener watching the window width has been moved to its own custom hook. If we will need the height in the future, then we can easily add it later and return it from the hook as a ref.

## Final notes

I have used Windows as a development environment after quite a long time. The OS should not make a big difference, of course. But from time to time, tools like the linter or even project bundlers themselves might have issues because of it.

Since the application is started from scratch and without a clear structure in mind for the files and functionality, it seemed less efficient to write the unit tests with each commit. However, they were kept in mind while developing.

It's the first time I have used Vue's Composition API for a project, so I am getting familiarized with it's options and way of doing things. One thing I have to dig deeper into is the way reactivity actually works. The first impression is that there are many ways to get to the same outcome, so it's necessary to learn more about how it actually works in order to be able to pick the right approach when needed.

Depending on the team decisions, we might want to comment more on the functions and variables than how I chose to do it in this project. I decided to comment only where the solution / the choice made was not the obvious way to go or where the code alone seemed ambiguous.

---

Using Vue 3 for the first time has proven to be more time consuming than initially estimated. This is the main reason why topics such as testing or a proper JS/TS based horizontal slider have not been implemented in the initially set time. However, I do how this repo shows knowledge of JS/TS, the capacity to learn a new-ish frontend framework rather fast, basic task management skills. :)
