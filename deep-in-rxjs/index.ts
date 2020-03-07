import { Observable, OperatorFunction, Observer, of, Subscriber, Subject } from "rxjs";
// type OperatorFunction<T, R> = (source: Observable<T>) => Observable<R>

function map<T, R>(project: (value: T) => R): OperatorFunction<T, R> {
  return function mapOperation(source$: Observable<T>): Observable<R> {
    if (typeof project !== "function") {
      throw new TypeError("argument is not a function...");
    }
    return Observable.create((observer: Subscriber<R>) => {
      const subscription = source$.subscribe({
        next: value => {
          try {
            observer.next(project(value));
          } catch (e) {
            observer.error(e);
          }
        },
        error: observer.error,
        complete: observer.complete,
      });
      return () => {
        subscription.unsubscribe();
      };
    });
  };
}

const source$ = of(1, 2, 3);
const sub = map((x: number) => x * x)(source$).subscribe({
  next: console.log,
  complete: () => console.log('ok')
});

const subject = new Subject()
