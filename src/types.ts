export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type Transformer<A, B> = (a: A) => B;
export type Procedure<A> = Transformer<A, void>;
export type Predicate<A> = Transformer<A, boolean>;

export type Combinator<A, B, C> = (a: A, b: B) => C;
export type Reducer<A, B> = Combinator<B, A, B>;
export type Comparator<A> = Combinator<A, A, number>;
export type Accumulator<A> = Combinator<A, A, A>;
