import { TagFilterProps } from "@/types/tag";

const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  onTagSelect,
}: TagFilterProps) => {
  return (
    <div>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onTagSelect(tag.name)}
          className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md p-2 m-2"
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;
