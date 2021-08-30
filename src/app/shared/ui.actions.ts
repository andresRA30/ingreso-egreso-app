import { createAction } from '@ngrx/store';

export const isLoading = createAction('[Counter Component] is Loading');

export const stopLoading = createAction('[Counter Component] stop Loading');