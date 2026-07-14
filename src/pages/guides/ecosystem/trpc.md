---
title: tRPC
label: tRPC
layout: guides
order: 5
tocHeading: 2
---

# tRPC

[**tRPC**](https://trpc.io/) is a TypeScript library that provides full-stack end-to-end type safety for applications, using inference to keep your types in sync from client to server.

> You can see the complete example in the [companion repo](https://github.com/thescientist13/greenwood-trpc/) to this guide.

## Installation

> _This guide assumes tRPC v11.x and Zod 4.x._

First, let's install the tRPC client and server packages, as well as [**Zod**](https://zod.dev/); a TypeScript schema validation library.

<!-- prettier-ignore-start -->
<app-ctc-block variant="runners">

  ```shell
  npm i @trpc/client @trpc/server zod
  ```

  ```shell
  yarn add @trpc/client @trpc/server zod
  ```

  ```shell
  pnpm add @trpc/client @trpc/server zod
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

## Demo

For this example, we assume an existing data source. The demonstration repo uses SQLite with Node's `node:sqlite` client sourced from a JSON file, but you can use any data source you want.

There are three key files:

- Greenwood [Dynamic API Route](/docs/pages/api-routes/#dynamic-routing) - Single endpoint for handling all tRPC requests
- Client - For making API requests to the backend
- Router - Source of truth for the API contract

### Router

Let's start with the router, which will be used by both the client and API endpoint. For this demo, we are configuring two methods for making requests:

1. List all planets
1. Get a single planet

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/trpc/router.ts">

  ```ts
  import { initTRPC } from '@trpc/server';
  // replace with your data source of choice
  import { db } from "../db/db.ts";
  import { z } from "zod";

  const t = initTRPC.create();
  const publicProcedure = t.procedure;
  const router = t.router;

  const planetsRouter = router({
    listPlanets: publicProcedure.query(() => db.getPlanets()),
    getPlanetById: publicProcedure
      .input(z.number())
      .query((opts) => db.getPlanetById(opts.input))
  });

  export const appRouter = router({
    planets: planetsRouter,
  });

  export type AppRouter = typeof appRouter;
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

### Client

Next, let's create our client, which we can then call from the frontend:

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/trpc/client.ts">

  ```ts
  import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
  import type { AppRouter } from './router.ts';

  const url: URL = new URL(`${window.location.origin}/api/rpc`);
  const client = createTRPCProxyClient<AppRouter>({
    links: [loggerLink(), httpBatchLink({ url })],
  });

  export { client };
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

### Endpoint

The last step is to create our dynamic API endpoint using tRPC's [fetch adapter](https://trpc.io/docs/server/adapters/fetch), and wire up the router to it:

> You can define the RPC endpoint and filename to be anything you want, it just has to be a dynamic route and match the url you define in the client. So any of the following would also work, for example:
>
> - _src/pages/api/rpc/[rpc].ts_
> - _src/pages/api/rpc/[url].ts_
> - _src/pages/api/rpc/[handler].ts_

<br/>

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/pages/api/rpc/[rpc].ts">

  ```ts
  import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
  import { appRouter } from '../../../trpc/router.ts';

  export async function handler(request: Request): Promise<Response> {
    const response = await fetchRequestHandler({
      endpoint: '/api/rpc',
      req: request,
      router: appRouter,
    });

    return response;
  }
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->

### Usage

Putting it all together we can now make calls with the client from anywhere within our application 🚀

<!-- prettier-ignore-start -->

<app-ctc-block variant="snippet" heading="src/index.ts">

  ```ts
  import { client } from './trpc/client.ts'

  const planets = await client.planets.listPlanets.query();

  planets.forEach((planet) => console.log({ planet }));
  ```

</app-ctc-block>

<!-- prettier-ignore-end -->
