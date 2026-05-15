export type SearchResult = {
  id: string;
  score: number;
  payload: Record<string, unknown>;
};

export type CurrentWorkspace = {
  id: string;
  slug: string;
  name: string;
};

export type CurrentUser = {
  id: string;
  email: string;
};

export interface ShellClient {
  semanticSearch(query: string, limit?: number): Promise<SearchResult[]>;
  audit(action: string, payload: Record<string, unknown>): Promise<void>;
  getCurrentWorkspace(): Promise<CurrentWorkspace>;
  getCurrentUser(): Promise<CurrentUser>;
}
