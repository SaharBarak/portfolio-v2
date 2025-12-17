/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as availability from "../availability.js";
import type * as blog from "../blog.js";
import type * as contributions from "../contributions.js";
import type * as freelance from "../freelance.js";
import type * as ideas from "../ideas.js";
import type * as links from "../links.js";
import type * as now from "../now.js";
import type * as projects from "../projects.js";
import type * as research from "../research.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  availability: typeof availability;
  blog: typeof blog;
  contributions: typeof contributions;
  freelance: typeof freelance;
  ideas: typeof ideas;
  links: typeof links;
  now: typeof now;
  projects: typeof projects;
  research: typeof research;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
