/* eslint-disable */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as AppleRouteImport } from './routes/apple'
import { Route as MinesRouteImport } from './routes/mines'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

const AdminRoute = AdminRouteImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => rootRouteImport,
} as any)

const AppleRoute = AppleRouteImport.update({
  id: '/apple',
  path: '/apple',
  getParentRoute: () => rootRouteImport,
} as any)

const MinesRoute = MinesRouteImport.update({
  id: '/mines',
  path: '/mines',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/admin': typeof AdminRoute
  '/apple': typeof AppleRoute
  '/mines': typeof MinesRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/admin': typeof AdminRoute
  '/apple': typeof AppleRoute
  '/mines': typeof MinesRoute
}

export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/admin': typeof AdminRoute
  '/apple': typeof AppleRoute
  '/mines': typeof MinesRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/admin' | '/apple' | '/mines'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/admin' | '/apple' | '/mines'
  id: '__root__' | '/' | '/admin' | '/apple' | '/mines'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AdminRoute: typeof AdminRoute
  AppleRoute: typeof AppleRoute
  MinesRoute: typeof MinesRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/apple': {
      id: '/apple'
      path: '/apple'
      fullPath: '/apple'
      preLoaderRoute: typeof AppleRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/mines': {
      id: '/mines'
      path: '/mines'
      fullPath: '/mines'
      preLoaderRoute: typeof MinesRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AdminRoute: AdminRoute,
  AppleRoute: AppleRoute,
  MinesRoute: MinesRoute,
}

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
