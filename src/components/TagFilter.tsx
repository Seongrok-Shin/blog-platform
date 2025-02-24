import { TagFilterProps } from "@/types/tag";

const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  onTagSelect,
}: TagFilterProps) => {
  return (
    <div>
      {tags.map((tag) => (
        <button
          key={tag.id} // Assuming `tag` has an `id` property
          onClick={() => onTagSelect(tag.name)} // Use `tag.name` if you want to pass the name to `onTagSelect`
          className="bg-gray-200 rounded-md p-2 m-2"
        >
          {tag.name} {/* Render the `name` of the tag */}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;
