export interface Tag {
  id: string;
  name: string;
  slug?: string;
  created_at?: string | Date | undefined;
  updated_at?: string | Date | undefined;
}

export interface CreateTagInput {
  name: string;
}

export interface UpdateTagInput {
  name: string;
}

export type TagFilterProps = {
  tags: Tag[];
  onTagSelect: (tagId: string) => void;
};
