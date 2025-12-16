export type Repository<TModel, TCreate> = {
  list: () => Promise<TModel[]>;
  create: (value: TCreate) => Promise<void>;
};
