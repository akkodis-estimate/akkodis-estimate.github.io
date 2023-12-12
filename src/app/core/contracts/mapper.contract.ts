import {Result} from "../params/result";

export abstract class Mapper<T, R, E> {
    abstract fromRequest(param: T): E;

    abstract toEntity(param: R): E;

    abstract fromEntity(param: E): R;

    toEntities(params: R[]): E[] {
        return params.map(param => this.toEntity(param));
    }

    fromEntities(params: E[]): R[] {
        return params.map(param => this.fromEntity(param));
    }

    toResponse(param: E): Result<R> {
        return param
            ? new Result<R>(true, "", this.fromEntity(param))
            : new Result<R>(false, "Not found", {} as R);
    }

    toFirstResponse(params: E[]): Result<R> {
        return params && params.length > 0
            ? new Result<R>(true, "", this.fromEntity(params[0]))
            : new Result<R>(false, "Not found", {} as R);
    }

    toResponses(params: E[]): Result<R[]> {
        return params && params.length > 0
            ? new Result<R[]>(true, "", this.fromEntities(params))
            : new Result<R[]>(false, "Not found", []);
    }
}
