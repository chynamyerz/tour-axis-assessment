import { Request } from 'express';
import { Query } from 'express-serve-static-core';

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export interface TypedRequestQuery<T extends Query> extends Request {
  query: { params: T };
}

export interface TypedRequest<QueryT extends Query, BodyT> extends Request {
  body: BodyT;
  query: { params: QueryT };
}
